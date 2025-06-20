import os
import boto3
import logging
from datetime import datetime, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.client('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'user-file-metadata')

def handler(event, context):
    try:
        user_id = event['userName']
        email = event['request']['userAttributes']['email']
        created_at = datetime.now(timezone.utc).isoformat()

        response = dynamodb.put_item(
            TableName=TABLE_NAME,
            Item={
                'PK': {'S': email},
                'SK': {'S': 'info'},
                'userId': {'S': user_id},
                'email': {'S': email},
                'createdAt': {'S': created_at}
            }
        )
        logger.info(f"PutItem succeeded: {response}")
        return event

    except Exception as e:
        logger.error(f"Error writing to DynamoDB: {str(e)}")
        raise e