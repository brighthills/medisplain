import os
import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.client('dynamodb')
TABLE_NAME = os.environ['TABLE_NAME']

def extract_field(item, field_name):
    return item.get(field_name, {}).get('S')

def handler(event, context):
    try:
        email = event['requestContext']['authorizer']['claims']['email']
        logger.info(f"Fetching items for user: {email}")

        response = dynamodb.query(
            TableName=TABLE_NAME,
            KeyConditionExpression='PK = :pk and begins_with(SK, :prefix)',
            ExpressionAttributeValues={
                ':pk': {'S': email},
                ':prefix': {'S': 'file#'}
            }
        )

        files = []
        for item in response.get('Items', []):
            file_info = {
                "filename": extract_field(item, "filename"),
                "userEmail": extract_field(item, "userEmail"),
                "userId": extract_field(item, "userId"),
                "uploadTimestamp": extract_field(item, "uploadTimestamp"),
                "createdAt": extract_field(item, "createdAt"),
                "status": extract_field(item, "status")
            }

            ai_summary = extract_field(item, "aiSummary")
            original_filename = extract_field(item, "originalFilename")
            if ai_summary:
                file_info["aiSummary"] = ai_summary
            if original_filename:
                file_info["originalFilename"] = original_filename

            files.append(file_info)

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "https://medisplain.brighthills.cloud",
                "Access-Control-Allow-Credentials": True,
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": json.dumps(files)
        }

    except Exception as e:
        logger.error(f"Failed to retrieve file list: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "https://medisplain.brighthills.cloud",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({"error": "Internal server error"})
        }