import boto3, os, json, logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client('sqs')
dynamodb = boto3.client('dynamodb')

queue_url = os.environ['QUEUE_URL']
table_name = os.environ['TABLE_NAME']
websocket_endpoint = os.environ['WEBSOCKET_ENDPOINT']

apigw_client = boto3.client(
    'apigatewaymanagementapi',
    endpoint_url=websocket_endpoint.replace("wss://", "https://")
)

def handler(event, context):
    logger.info(f"Received event:\n{json.dumps(event, indent=2)}")

    for record in event['Records']:
        if record['eventName'] not in ['INSERT', 'MODIFY']:
            logger.info("Skipping process! Event is not related to INSERT or MODIFY.")
            continue

        new_image = record['dynamodb'].get('NewImage', {})

        sk = new_image.get("SK", {}).get("S")
        if sk == "info":
            logger.info(f"Skipping process! Event is related with user#info --> SK={sk}")
            continue

        status = new_image.get('status', {}).get('S')
        original_filename = new_image.get('originalFilename', {}).get('S')
        ai_summary = new_image.get('aiSummary', {}).get('S')

        message = {
            "pk": new_image.get("PK", {}).get("S"),
            "sk": new_image.get("SK", {}).get("S"),
            "filename": new_image.get("filename", {}).get("S"),
            "s3Location": new_image.get("s3Location", {}).get("S"),
            "status": status,
            "aiSummary": ai_summary,
            "originalFilename": original_filename
        }

        if status == 'in-progress':
            sqs.send_message(QueueUrl=queue_url, MessageBody=json.dumps(message))
            logger.info(f"Sent message to queue for in-progress file: {message['filename']}")

        elif status == 'done':
            logger.info(f"File processing complete for: {message['filename']}")
            email = new_image.get("PK", {}).get("S")

            try:
                # Fetch connectionId from DynamoDB
                response = dynamodb.get_item(
                    TableName=table_name,
                    Key={"PK": {"S": email}, "SK": {"S": "info"}}
                )
                info_item = response.get("Item")
                if not info_item or "connectionId" not in info_item:
                    logger.warning(f"No connection found for user: {email}")
                    continue

                connection_id = info_item["connectionId"]["S"]
                apigw_client.post_to_connection(
                    ConnectionId=connection_id,
                    Data=json.dumps(message).encode("utf-8")
                )
                logger.info(f"Sent WebSocket message to {connection_id}")

            except Exception as e:
                logger.error(f"Error sending WebSocket message: {str(e)}")

        else:
            logger.error(f"Unexpected status value: {status} in record with SK={message['sk']}")