import boto3
import os
from datetime import datetime, timedelta
import urllib.request
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from botocore.signers import CloudFrontSigner
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

secrets = boto3.client('secretsmanager')
s3 = boto3.client('s3')
origin = os.environ.get('ORIGIN', '*')

def rsa_signer(message):
    secret_name = os.environ['CLOUDFRONT_PRIVATE_KEY_SECRET_NAME']
    private_key = secrets.get_secret_value(SecretId=secret_name)['SecretString']
    key = serialization.load_pem_private_key(
        private_key.encode('utf-8'),
        password=None,
        backend=default_backend()
    )
    return key.sign(
        message,
        padding.PKCS1v15(),
        hashes.SHA1()  # CloudFront **requires** SHA1
    )

def handler(event, context):
    try:
        filename = event['queryStringParameters'].get('filename')
        if not filename:
            return {
                'statusCode': 400,
                'body': 'Missing required query parameter: filename'
            }
        bucket_name = os.environ['BUCKET_NAME']

        # Check if the object exists in S3
        try:
            s3.head_object(Bucket=bucket_name, Key=filename)
        except s3.exceptions.ClientError as e:
            if e.response['Error']['Code'] == "404":
                return {
                    'statusCode': 404,
                    'body': f"File '{filename}' not found."
                }
            else:
                raise

        # Generate signed CloudFront URL
        cloudfront_url = f"https://{os.environ['CLOUDFRONT_URL_DOMAIN']}/{filename}"
        signer = CloudFrontSigner(os.environ['CLOUDFRONT_KEY_PAIR_ID'], rsa_signer)
        signed_url = signer.generate_presigned_url(
            url=cloudfront_url,
            date_less_than=datetime.utcnow() + timedelta(minutes=5)
        )

        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true"
            },
            'body': signed_url
        }

    except Exception as e:
        return {
            'statusCode': 500,
            "headers": {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": True
            },
            'body': f"Failed to generate signed URL: {str(e)}"
        }