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

        extension = filename.lower().split('.')[-1]
        if extension in ['jpg', 'jpeg', 'png']:
            sk = f"file#image#{filename}"
        elif extension == 'pdf':
            sk = f"file#document#{filename}"
        else:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": f"Unsupported file type: .{extension}"})
            }

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
                "body": json.dumps({"error": "File not found"})
            }

        result = {
            "filename": item["filename"]["S"],
            "userEmail": item["userEmail"]["S"],
            "userId": item["userId"]["S"],
            "uploadTimestamp": item["uploadTimestamp"]["S"],
            "createdAt": item["createdAt"]["S"],
            "status": item["status"]["S"],
        }

        if "aiSummary" in item:
            result["aiSummary"] = item["aiSummary"]["S"]

        if "originalFilename" in item:
            result["originalFilename"] = item["originalFilename"]["S"]

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:4200",
                "Access-Control-Allow-Credentials": True,
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": json.dumps(result)
        }

    except Exception as e:
        logger.error(f"Error retrieving file metadata: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:4200",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({"error": str(e)})
        }