import json
import base64
import boto3
import uuid
import os
from datetime import datetime

s3 = boto3.client('s3')
bucket = os.environ['BUCKET_NAME']

def handler(event, context):
    try:
        # Decode base64-encoded image from JSON body
        body = json.loads(event['body'])
        image_data = base64.b64decode(body['image_base64'])
        filename = f"{uuid.uuid4()}.jpg"

        # Get Cognito user identity from authorizer claims
        claims = event.get('requestContext', {}).get('authorizer', {}).get('claims', {})
        uploader_email = claims.get('email', 'unknown')
        uploader_id = claims.get('sub', 'unknown')

        # Add custom metadata
        metadata = {
            'user-email': uploader_email,
            'user-id': uploader_id,
            'upload-timestamp': datetime.utcnow().isoformat()
        }

        # Upload image to S3 with metadata
        s3.put_object(
            Bucket=bucket,
            Key=filename,
            Body=image_data,
            ContentType='image/jpeg',
            Metadata=metadata
        )

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({
                "message": "Image uploaded",
                "filename": filename,
                "metadata": metadata
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }