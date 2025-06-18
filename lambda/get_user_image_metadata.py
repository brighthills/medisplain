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
        filename = event['queryStringParameters']['filename']
        if not filename:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing filename query parameter"})
            }

        sk = f"image#{filename}"

        response = dynamodb.get_item(
            TableName=TABLE_NAME,
            Key={
                'PK': {'S': email},
                'SK': {'S': sk}
            }
        )

        item = response.get('Item')
        if not item:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Image not found"})
            }

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({
                "filename": item["filename"]["S"],
                "userEmail": item["userEmail"]["S"],
                "userId": item["userId"]["S"],
                "uploadTimestamp": item["uploadTimestamp"]["S"],
                "createdAt": item["createdAt"]["S"]
            })
        }

    except Exception as e:
        logger.error(f"Error retrieving image metadata: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }