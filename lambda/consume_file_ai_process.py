import boto3
import json
import os
import logging
from datetime import datetime, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')
dynamodb = boto3.client('dynamodb')

TABLE_NAME = os.environ.get('TABLE_NAME', 'user-file-metadata')

def handler(event, context):
    for record in event["Records"]:
        try:
            body = json.loads(record["body"])
            logger.info(f"Received message: {body}")

            # Extract values using lowercase keys
            s3_location = body.get("s3Location")
            pk = body.get("pk")
            sk = body.get("sk")

            if not s3_location or not pk or not sk:
                raise ValueError("Missing required fields: s3Location, pk, or sk")

            # Parse bucket and key
            if not s3_location.startswith("s3://"):
                raise ValueError(f"Invalid s3Location format: {s3_location}")

            _, _, bucket, *key_parts = s3_location.split("/")
            key = "/".join(key_parts)

            # Attempt to download the file
            logger.info(f"⬇Downloading S3 object from bucket: {bucket}, key: {key}")
            s3.get_object(Bucket=bucket, Key=key)
            logger.info(f"Successfully downloaded {s3_location}")

#  -----------------------
#   ToDo:
#       some processing towards AI suppose to be implemented here
#  -----------------------

            # Update DynamoDB item to mark as processed
            now_iso = datetime.now(timezone.utc).isoformat()
            dynamodb.update_item(
                TableName=TABLE_NAME,
                Key={
                    'PK': {'S': pk},
                    'SK': {'S': sk}
                },
                UpdateExpression="SET #status = :done, updatedAt = :updated",
                ExpressionAttributeNames={"#status": "status"},
                ExpressionAttributeValues={
                    ":done": {"S": "done"},
                    ":updated": {"S": now_iso}
                }
            )

            logger.info(f"✅ Updated status to 'done' for PK={pk}, SK={sk}")

        except Exception as e:
            logger.error(f"Error processing record: {str(e)}")
            raise e  # To allow retry or DLQ fallback