import boto3
import json
import os
import logging
from datetime import datetime, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.client('dynamodb')
s3 = boto3.client('s3')
TABLE_NAME = os.environ.get('TABLE_NAME', 'user-file-metadata')
STATUS = 'in-progress'

def handler(event, context):
    for record in event["Records"]:
        try:
            body = json.loads(record["body"])

            # Skip S3 test events
            if body.get("Event") == "s3:TestEvent":
                logger.info("Skipping S3 test event")
                continue

            for s3_record in body.get("Records", []):
                if s3_record.get("eventName") != "ObjectCreated:Put":
                    logger.info("Skipping non-object creation event")
                    continue

                bucket = s3_record["s3"]["bucket"]["name"]
                key = s3_record["s3"]["object"]["key"]

                logger.info(f"Processing file {key} from bucket {bucket}")

                # Get object metadata
                head = s3.head_object(Bucket=bucket, Key=key)
                metadata = head.get("Metadata", {})

                user_email = metadata.get("user-email")
                user_id = metadata.get("user-id")
                upload_timestamp = metadata.get("upload-timestamp")
                createdAt = datetime.now(timezone.utc).isoformat()

                # Determine file type based on extension
                extension = key.lower().split('.')[-1]
                if extension in ["png", "jpeg", "jpg"]:
                    sk_prefix = "file#image#"
                elif extension == "pdf":
                    sk_prefix = "file#document#"
                else:
                    logger.warning(f"Unsupported file type for {key}, skipping")
                    continue

                s3_location = f"s3://{bucket}/{key}"

                item = {
                    'PK': {'S': user_email},
                    'SK': {'S': f'{sk_prefix}{key}'},
                    'filename': {'S': key},
                    'userEmail': {'S': user_email},
                    'userId': {'S': user_id},
                    'uploadTimestamp': {'S': upload_timestamp},
                    'createdAt': {'S': createdAt},
                    'status': {'S': STATUS},
                    's3Location': {'S': s3_location}
                }

                # Store metadata in DynamoDB
                dynamodb.put_item(TableName=TABLE_NAME, Item=item)
                logger.info(f"Inserted metadata for {key} into DynamoDB")

        except Exception as e:
            logger.error(f"Failed to process record: {str(e)}")
            raise e