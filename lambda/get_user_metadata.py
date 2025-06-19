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
        claims = event.get('requestContext', {}).get('authorizer', {}).get('claims', {})
        email = claims.get('email')
        if not email:
            raise ValueError("Missing 'email' in token claims")

        response = dynamodb.get_item(
            TableName=TABLE_NAME,
            Key={
                'PK': {'S': email},
                'SK': {'S': 'info'}
            }
        )

        item = response.get('Item')
        if not item:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "User metadata not found"})
            }

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:4200",
                "Access-Control-Allow-Credentials": True,
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": json.dumps({
                "userId": item['userId']['S'],
                "email": item['email']['S'],
                "createdAt": item['createdAt']['S']
            })
        }

    except Exception as e:
        logger.error(f"Error retrieving user metadata: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:4200",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({"error": str(e)})
        }