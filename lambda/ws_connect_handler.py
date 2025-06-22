import boto3
import os
import logging

dynamodb = boto3.client("dynamodb")
TABLE_NAME = os.environ["TABLE_NAME"]

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    try:
        connection_id = event["requestContext"]["connectionId"]
        query_params = event.get("queryStringParameters") or {}
        email = query_params.get("email")

        if not email:
            logger.error("Missing email parameter.")
            return {"statusCode": 400, "body": "Missing email parameter."}

        # Save info item and GSI for quick disconnect lookup
        dynamodb.put_item(
            TableName=TABLE_NAME,
            Item={
                "PK": {"S": email},
                "SK": {"S": "info"},
                "connectionId": {"S": connection_id},
                "GSI1PK": {"S": f"connection#{connection_id}"},
                "GSI1SK": {"S": email}
            }
        )

        logger.info(f"Connected: {connection_id} for {email}")
        return {
            "statusCode": 200,
            "body": f"Connected with ID: {connection_id}"
        }

    except Exception as e:
        logger.error(f"Error in $connect handler: {str(e)}")
        return {"statusCode": 500, "body": "Internal server error"}