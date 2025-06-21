import boto3, os, json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client('sqs')
queue_url = os.environ['QUEUE_URL']

def handler(event, context):
    for record in event['Records']:
        if record['eventName'] not in ['INSERT', 'MODIFY']:
            logger.info(f"Skipping process! Event is not related to INSERT or MODIFY.")
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