import boto3
import os
import logging

dynamodb = boto3.client("dynamodb")
TABLE_NAME = os.environ["TABLE_NAME"]
GSI_NAME = "GSI1"

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    connection_id = event["requestContext"]["connectionId"]
    logger.info(f"Disconnect triggered for connectionId: {connection_id}")

    try:
        # Query the GSI to get the email associated with the connectionId
        response = dynamodb.query(
            TableName=TABLE_NAME,
            IndexName=GSI_NAME,
            KeyConditionExpression="GSI1PK = :pk",
            ExpressionAttributeValues={":pk": {"S": f"connection#{connection_id}"}}
        )

        if not response["Items"]:
            logger.warning(f"No matching connection found for ID: {connection_id}")
            return {"statusCode": 200}

        for item in response["Items"]:
            email = item["PK"]["S"]
            logger.info(f"Found user {email} for connectionId {connection_id}")

            # Remove the connection info
            dynamodb.update_item(
                TableName=TABLE_NAME,
                Key={"PK": {"S": email}, "SK": {"S": "info"}},
                UpdateExpression="REMOVE connectionId, GSI1PK, GSI1SK"
            )

            logger.info(f"Disconnected user {email}")

        return {"statusCode": 200}

    except Exception as e:
        logger.error(f"Failed to disconnect: {str(e)}")
        return {"statusCode": 500}