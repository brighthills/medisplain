import boto3
import os
import json
import urllib.request

def send_response(event, context, status, data, reason=None):
    response_body = {
        'Status': status,
        'Reason': reason or 'See the details in CloudWatch Log Stream: ' + context.log_stream_name,
        'PhysicalResourceId': context.log_stream_name,
        'StackId': event['StackId'],
        'RequestId': event['RequestId'],
        'LogicalResourceId': event['LogicalResourceId'],
        'Data': data
    }

    json_response = json.dumps(response_body)
    headers = {
        'content-type': '',
        'content-length': str(len(json_response))
    }

    try:
        req = urllib.request.Request(
            url=event['ResponseURL'],
            data=json_response.encode('utf-8'),
            headers=headers,
            method='PUT'
        )
        with urllib.request.urlopen(req) as response:
            print("Status:", response.status)
    except Exception as e:
        print("Failed to send response:", str(e))


def handler(event, context):
    s3 = boto3.client('s3')
    sm = boto3.client('secretsmanager')

    bucket = os.environ['BUCKET_NAME']
    key = os.environ['S3_KEY']
    secret_name = os.environ['SECRET_NAME']

    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        private_key = response['Body'].read().decode('utf-8')

        try:
            sm.describe_secret(SecretId=secret_name)
            sm.put_secret_value(
                SecretId=secret_name,
                SecretString=private_key
            )
        except sm.exceptions.ResourceNotFoundException:
            sm.create_secret(
                Name=secret_name,
                SecretString=private_key
            )

        send_response(event, context, 'SUCCESS', {"SecretName": secret_name})
    except Exception as e:
        print(f"ERROR: {e}")
        send_response(event, context, 'FAILED', {"Message": str(e)}, reason=str(e))