import boto3
import json
import os
import logging
from datetime import datetime, timezone
import io
from PyPDF2 import PdfReader
import urllib3
import openai

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')
dynamodb = boto3.client('dynamodb')

TABLE_NAME = os.environ.get('TABLE_NAME', 'user-file-metadata')
port = os.environ['PARAMETERS_SECRETS_EXTENSION_HTTP_PORT']
aws_session_token = os.environ['AWS_SESSION_TOKEN']
secret_arn = os.environ['OPENAI_API_KEY_SECRET_ARN']
http = urllib3.PoolManager()
system_prompt_parameter_name = os.environ['OPENAI_SYSTEM_PROMPT_PARAMETER_NAME']
user_prompt_parameter_name = os.environ['OPENAI_USER_PROMPT_PARAMETER_NAME']

def handler(event, context):
    for record in event["Records"]:
        try:
            body = json.loads(record["body"])
            logger.info(f"Received message: {body}")

            # Extract values using lowercase keys
            s3_location = body.get("s3Location")
            pk = body.get("pk")
            sk = body.get("sk")

            if not s3_location or not pk or not sk:
                raise ValueError("Missing required fields: s3Location, pk, or sk")

            # Parse bucket and key
            if not s3_location.startswith("s3://"):
                raise ValueError(f"Invalid s3Location format: {s3_location}")

            _, _, bucket, *key_parts = s3_location.split("/")
            key = "/".join(key_parts)

            # Attempt to download the file
            logger.info(f"⬇Downloading S3 object from bucket: {bucket}, key: {key}")
            response = s3.get_object(Bucket=bucket, Key=key)
            logger.info(f"Successfully downloaded {s3_location}")

            extracted_text = extract_text(response)
            ai_summary = analyze_medical_record(extracted_text)

            # Update DynamoDB item to mark as processed
            now_iso = datetime.now(timezone.utc).isoformat()
            dynamodb.update_item(
                TableName=TABLE_NAME,
                Key={
                    'PK': {'S': pk},
                    'SK': {'S': sk}
                },
                UpdateExpression="SET #status = :done, updatedAt = :updated, aiSummary = :aiSummary",
                ExpressionAttributeNames={"#status": "status"},
                ExpressionAttributeValues={
                    ":done": {"S": "done"},
                    ":updated": {"S": now_iso},
                    ":aiSummary": {"S": ai_summary}
                }
            )

            logger.info(f"✅ Updated status to 'done' for PK={pk}, SK={sk}")

        except Exception as e:
            logger.error(f"Error processing record: {str(e)}")
            raise e  # To allow retry or DLQ fallback
        
def retrieve_extension_value(url): 
    url = ('http://localhost:' + port + url)
    headers = { "X-Aws-Parameters-Secrets-Token": aws_session_token }
    response = http.request("GET", url, headers=headers)
    response = json.loads(response.data)   
    return response

def get_secret():
    secrets_url = ('/secretsmanager/get?secretId=' + secret_arn)
    return retrieve_extension_value(secrets_url)['SecretString']

def get_parameter(parameter_name):
    parameter_url = ('/systemsmanager/parameters/get?name=' + parameter_name)
    parameter_string = retrieve_extension_value(parameter_url)['Parameter']['Value']
    return parameter_string

def extract_text(pdf_file):
    pdf_reader = PdfReader(io.BytesIO(pdf_file['Body'].read()))
    text = " ".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
    return text

def analyze_medical_record(text):
    logger.info("Analyzing medical record")

    client = openai.OpenAI(api_key=get_secret())
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": get_parameter(system_prompt_parameter_name)},
            {"role": "user", "content": "This is a medical report. Explain in simple terms what this means:\n\n{text}\n\nThe answer should not contain any privacy information."}
        ],
        temperature=0.5
    )
    logger.info("Successfully analized medical record")
    raw_ai_summary = response.choices[0].message.content
    clean_json_str = raw_ai_summary.strip('`').replace('json\n', '', 1).strip()
    ai_summary = json.loads(clean_json_str)
    return ai_summary