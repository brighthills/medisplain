import boto3, os, json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client('sqs')
queue_url = os.environ['QUEUE_URL']

def handler(event, context):
    # Log full event object for debugging
    logger.info(f"Received event:\n{json.dumps(event, indent=2)}")

    for record in event['Records']:
        if record['eventName'] not in ['INSERT', 'MODIFY']:
            logger.info("Skipping process! Event is not related to INSERT or MODIFY.")
            continue

        new_image = record['dynamodb'].get('NewImage', {})
        status = new_image.get('status', {}).get('S')

        if status == 'in-progress':
            message = {
                "pk": new_image.get("PK", {}).get("S"),
                "sk": new_image.get("SK", {}).get("S"),
                "filename": new_image.get("filename", {}).get("S"),
                "s3Location": new_image.get("s3Location", {}).get("S")
            }

            sqs.send_message(QueueUrl=queue_url, MessageBody=json.dumps(message))
            logger.info(f"Sent message to queue for in-progress file: {message['filename']}")

        elif status == 'done':
            logger.info(f"File processing complete for: {new_image.get('filename', {}).get('S')}")
        #  -----------------------
        #   ToDo:
        #       lambda should trigger a Websocket API call
        #  -----------------------

        else:
            logger.error(f"Unexpected status value: {status} in record with SK={new_image.get('SK', {}).get('S')}")