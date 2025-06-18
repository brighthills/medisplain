import os
import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.client('dynamodb')
TABLE_NAME = os.environ['TABLE_NAME']

def handler(event, context):
    try:
        email = event['requestContext']['authorizer']['claims']['email']

        response = dynamodb.query(
            TableName=TABLE_NAME,
            KeyConditionExpression='PK = :pk and begins_with(SK, :prefix)',
            ExpressionAttributeValues={
                ':pk': {'S': email},
                ':prefix': {'S': 'image#'}
            }
        )

        images = []
        for item in response.get('Items', []):
            images.append({
                "filename": item.get("filename", {}).get("S"),
                "userEmail": item.get("userEmail", {}).get("S"),
                "userId": item.get("userId", {}).get("S"),
                "uploadTimestamp": item.get("uploadTimestamp", {}).get("S"),
                "createdAt": item.get("createdAt", {}).get("S"),
            })

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps(images)
        }

    except Exception as e:
        logger.error(f"Failed to retrieve image list: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error"})
        }