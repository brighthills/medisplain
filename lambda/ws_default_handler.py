import json

def handler(event, context):
    print(f"Received event: {json.dumps(event)}")

    connection_id = event['requestContext']['connectionId']
    message = event.get('body', 'No message')
    try:
        response = {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Message received",
                "connectionId": connection_id,
                "data": message
            })
        }
        return response
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error"})
        }