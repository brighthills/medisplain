import json
import base64
import boto3
import uuid
import os
from datetime import datetime

s3 = boto3.client('s3')
bucket = os.environ['BUCKET_NAME']

def get_file_type_and_extension(base64_data):
    if base64_data.startswith('/9j/'):
        return 'image/jpeg', '.jpg'
    elif base64_data.startswith('iVBOR'):
        return 'image/png', '.png'
    elif base64_data.startswith('JVBER'):
        return 'application/pdf', '.pdf'
    else:
        raise ValueError("Unsupported file type")

def handler(event, context):
    try:
        body = json.loads(event['body'])

        base64_data = body['file_base64']
        original_filename = body.get('original_filename', 'unknown')
        file_binary = base64.b64decode(base64_data)

        content_type, extension = get_file_type_and_extension(base64_data[:20])
        filename = f"{uuid.uuid4()}{extension}"

        claims = event.get('requestContext', {}).get('authorizer', {}).get('claims', {})
        uploader_email = claims.get('email', 'unknown')
        uploader_id = claims.get('sub', 'unknown')

        metadata = {
            'user-email': uploader_email,
            'user-id': uploader_id,
            'upload-timestamp': datetime.utcnow().isoformat(),
            'original-filename': original_filename
        }

        s3.put_object(
            Bucket=bucket,
            Key=filename,
            Body=file_binary,
            ContentType=content_type,
            Metadata=metadata
        )

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "https://medisplain.brighthills.cloud",
                "Access-Control-Allow-Credentials": True,
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": json.dumps({
                "message": "File uploaded",
                "filename": filename,
                "original_filename": original_filename,
                "metadata": metadata
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "https://medisplain.brighthills.cloud",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({"error": str(e)})
        }