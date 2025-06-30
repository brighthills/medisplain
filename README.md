# MediSplain

MediSplain is a fully serverless platform for authenticated file uploads, metadata processing, AI-powered PDF analysis, and secure file access — built with AWS services and Angular frontend. It leverages robust IAM controls, OIDC-based GitHub CI/CD, and modular CloudFormation deployments.

---

## Infrastructure and Architecture Built:

- ### Core Components
  - Authentication & Authorization – AWS Cognito
  - AI File Analysis – OpenAI API via Lambda
  - Frontend Interface – Angular SPA hosted on CloudFront
  - File Upload & Metadata Processing – S3, Lambda, SQS (Event source Mapping), DynamoDB (Event Streams)
---  
- ### Cognito
  - Authentication & Authorization – AWS Cognito
    - Cognito User Pool for secure, managed user identity
    - Pre-sign-up Lambda to automatically store basic user info in DynamoDB
    - Admin-only user creation using AdminCreateUser
    - Email verification & password policies enforced
    - Cognito User Pool Client with ALLOW_ADMIN_USER_PASSWORD_AUTH
---
- ### Data Storage with DynamoDB
  - Uses a single-table design optimized for access patterns.
  - Primary Key (Partition + Sort Key):

  | Attribute | Type | Purpose |
  | --------- | ---- | ------- |
  | PK	String (S) | Partition Key: Always the user’s email |
  | SK | String (S) | Sort Key: Differentiates data types |

- Sort Key Variants

  | SK Format                   | Description |
  |-----------------------------| ----------- |
  | info                        | Basic user info row |
  | ```file#image#file.jpg```   | Metadata for image uploads |
  | ```file#document#doc.pdf``` | Metadata for PDF uploads |

- Created during sign-up by the persist_user_info.py Lambda:
```
{
  "PK": "user@example.com",
  "SK": "info",
  "userId": "<UUID from Cognito>",
  "userEmail": "user@example.com",
  "createdAt": "2025-06-30T10:20:30Z"
}
```

- Created by the consume_file_metadata.py Lambda after S3 upload and SQS event:
```
{
  "PK": "user@example.com",
  "SK": "file#image#uploaded-file.jpg",
  "filename": "uploaded-file.jpg",
  "originalFilename": "catphoto.jpg",
  "userId": "uuid-123",
  "userEmail": "user@example.com",
  "uploadTimestamp": "2025-06-30T10:00:00Z",
  "createdAt": "2025-06-30T10:05:00Z",
  "status": "in-progress",
  "s3Location": "s3://.../uploaded-file.jpg"
}
```

- Later updated by consume_file_ai_process.py Lambda with:
```
"status": "done",
"aiSummary": "{shortExplanation: ..., keyFindings: ...}"
```

---

- ### Lambda Functions
- The project uses a modular and event-driven Lambda architecture to handle everything from user registration to file processing and AI analysis. 
- In-depth breakdown of each Lambda function's role, trigger, dependencies, and interaction with AWS services like S3, SQS, DynamoDB, Secrets Manager, CloudFront, and OpenAI.
- Overview of Lambda Functions
- 
  | Lambda Name | Trigger | Purpose |
  | ----------- | ------- | ------- |
  | persist_user_info.py | Cognito PreSignUp trigger | Stores basic user info into DynamoDB |
  | upload_handler.py | API Gateway (POST /upload) | Uploads files to S3 with metadata |
  | consume_file_metadata.py | SQS (S3:ObjectCreated events) | Extracts metadata from uploaded file |
  | consume_file_ai_process.py | SQS (PDF uploads only) | Performs AI analysis using OpenAI |
  | get_user_metadata.py | API Gateway (GET /user) | Retrieves basic user info |
  | list_user_files.py | API Gateway (GET /files) | Lists all uploaded files by the user |
  | get_user_file_metadata.py | API Gateway (GET /file-meta) | Retrieves metadata for a specific file |
  | file_download_handler.py | API Gateway (GET /download) | Generates a signed CloudFront URL |
  | ws_connect_handler.py | WebSocket Connect | Handles WS client connection setup |
  | ws_default_handler.py | WebSocket Default Route | Handles unrecognized WS messages |
  | ws_disconnect_handler.py | WebSocket Disconnect | Cleans up on client disconnect |
  | file_metadata_stream_processor.py | DynamoDB Stream (optional) | Post-insert processing (not primary path) |
  | secret_creator.py | CLI/automation (CloudFormation) | Stores secrets (OpenAI key, etc.) |

- Functions deep dive:
  1. ```persist_user_info.py```
     - Trigger: Cognito pre-signup
     - Role: On new user signup, stores metadata:
       - ```PK = email```
       - ```SK = info```
       - ```userId```, ```userEmail```, ```createdAt```
     - AWS Integration: DynamoDB
     - Security: Scoped IAM permission to ```PutItem```

  2. ```upload_handler.py```
     - Trigger: API Gateway ```/upload```
     - Role:
       - Accepts file (image/pdf)
       - Extracts metadata from request headers
       - Uploads to S3 under predefined bucket
       - Includes ```original-filename```, ```upload-timestamp```, ```user-id```, ```user-email``` as S3 object metadata
     - AWS Integration: S3
     - IAM Requirements: ```PutObject```

  3. ```consume_file_metadata.py```
     - Trigger: SQS event from S3 (ObjectCreated:Put)
     - Role:
       - Reads file metadata using ```head_object```
       - Detects file type from extension
       - Creates metadata item in DynamoDB:
         - ```PK = email```, ```SK = file#image#filename.jpg```
       - Sets ```status = in-progress```
     - AWS Integration: S3, SQS, DynamoDB

  4. ```consume_file_ai_process.py```
     - Trigger: SQS (only for PDF uploads)
     - Role:
       - Downloads PDF file from S3
       - Extracts text using PyPDF2
       - Retrieves prompt templates from Parameter Store
       - Fetches API key from Secrets Manager
       - Calls OpenAI (GPT-4o) to summarize the document
       - Updates DynamoDB record: ```status = done```, adds ```aiSummary```
     - AWS Integration: S3, DynamoDB, SSM, Secrets Manager, OpenAI
     - Security: Uses secure local endpoint via ```AWS_SESSION_TOKEN```

  5. ```get_user_metadata.py```
     - Trigger: API Gateway (GET ```/user```)
     - Role: Queries DynamoDB for user profile row ```SK = info```
     - Returns: ```email```, ```userId```, ```createdAt```
     - AWS Integration: DynamoDB

  6. ```list_user_files.py```
     - Trigger: API Gateway (GET ```/files```)
     - Role:
       - Uses ```Query``` on DynamoDB with:
         - ```PK = email```
         - ```begins_with(SK, file#)```
       - Returns list of all file metadata for user
     - AWS Integration: DynamoDB

  7. ```get_user_file_metadata.py```
     - Trigger: API Gateway (GET ```/file-meta?filename=...```)
     - Role:
       - Builds ```SK``` from filename + extension
       - Returns single record from DynamoDB
       - Includes optional ```aiSummary```, ```originalFilename``` if available
     - AWS Integration: DynamoDB

  8. ```file_download_handler.py```
     - Trigger: API Gateway (GET ```/download?filename=...```)
     - Role:
       - Validates file exists in S3
       - Uses private RSA key (Secrets Manager) to sign CloudFront URL
       - Returns a 5-minute signed link
       - ```CLOUDFRONT_KEY_PAIR_ID```, ```CLOUDFRONT_URL_DOMAIN``` via env vars
     - AWS Integration: S3, CloudFront, Secrets Manager
     - Libraries: Uses ```cryptography```, ```CloudFrontSigner``` from boto3

  9. WebSocket Handlers
     ```ws_connect_handler.py```, ```ws_disconnect_handler.py```, ```ws_default_handler.py```
     - Trigger: WebSocket routes
     - Role: Manages bi-directional sessions (e.g., for file status updates or live notifications)
     - AWS Integration: API Gateway WebSocket, likely DynamoDB or a session store (not deeply defined in provided code)

  10. ```file_metadata_stream_processor.py```
      - Trigger: DynamoDB Streams
      - Role: Meant to react to new metadata inserts. Could invoke external systems or sync with another service.

  11. ```secret_creator.py```
      - Trigger: Manual or stack init
      - Role: Uploads OpenAI API key to Secrets Manager
  
- ### API Gateway Integration
  - Cognito authorization enforced
  - API Gateway routes (Cognito protected)
  - Lambda proxy integrations used for streamlined processing
  
  | Method | Path | Lambda | Description |
  | ------ | ---- | ------ | ----------- |
  | GET | /user | get_user_metadata.py | Basic user info |
  | GET | /files | list_user_files.py | All uploaded files for user |
  | GET | /file-meta?filename= | get_user_file_metadata.py | Metadata for a specific file |
  | GET | /download?filename= | file_download_handler.py | Signed CloudFront URL for secure access |
  | POST | /upload | upload_handler.py | Upload file (image/pdf) with metadata |
  
- ### File Handling & Processing
  - Files uploaded to S3
  - Object metadata (user-id, user-email, etc.) set on upload
  - S3 sends event → SQS queue → Lambda consumes metadata → DynamoDB stores it

- ###  SQS Integration
  - The SQS integration in MediSplain is central to its event-driven architecture. It decouples various components, ensures fault tolerance, and allows for asynchronous processing of file uploads and AI analysis.
  - What is SQS Used For?
    - MediSplain uses Amazon SQS for:
      - Relaying S3 upload events to metadata processing Lambdas
      - Queuing AI processing tasks for PDF files
      - (Potentially) enabling retry or DLQ logic for failed events
      - Flow 1: S3 ➜ SQS ➜ ```consume_file_metadata.py```
        - Trigger Flow
          - User uploads a file to S3 (via ```upload_handler.py```)
          - S3 triggers an event for ```ObjectCreated:Put```
          - Event is pushed to an SQS queue named something like ```ImageUploadQueue```
          - ```consume_file_metadata.py``` Lambda is subscribed to that queue
        - Inside ```consume_file_metadata.py```
          - Processes each message from SQS
          - Skips ```s3:TestEvent```
          - Uses ```head_object()``` to get metadata
          - Stores structured metadata in DynamoDB
          - For PDF files, may optionally forward the message to another queue (for AI processing)
      - Flow 2: AI Processing ➜ ```consume_file_ai_process.py```
        - Trigger Flow (PDFs only)
          - Either from within ```consume_file_metadata.py```, or a second S3 event rule, a message is sent to another queue: ```PDFAnalysisQueue```
          - ```consume_file_ai_process.py``` is subscribed to this queue
        - Inside ```consume_file_ai_process.py```
          - Retrieves file location, downloads from S3
          - Extracts text (using PyPDF2)
          - Summarizes via OpenAI
          - Updates DynamoDB record with:
          - ```"status": "done"```
          - ```"aiSummary"``` (structured JSON)

- ### Security
  - IAM roles scoped with least privilege (per Lambda)
  - S3 bucket policies allow only required services (Lambda, S3 to SQS)
  - SQS access tightly restricted by source ARN (S3)
  - API Gateway routes protected via Cognito JWT token

- ### Application configuration
  - Configuration values (e.g., OpenAI user/system prompts) stored in AWS Systems Manager Parameter Store
  - Secure and centralized parameter management for dynamic app behavior

- ### Automation with CloudFormation
  - Modular CloudFormation templates:
    - Cognito & API Gateway
    - S3 Buckets & IAM
    - SQS Queue
    - Lambda function stacks
  - Outputs exported/imported across stacks using Export / ImportValue.

- ### AI Analysis (Lambda + OpenAI)
- consume_file_ai_process.py Lambda:
  - Fetches uploaded PDF
  - Extracts text (via PyPDF2)
  - Gets system/user prompts from SSM Parameters
  - Invokes GPT-4o using API key from AWS Secrets Manager
  - Stores structured AI summary back in DynamoDB (aiSummary field)

- ### Frontend (Angular)
Located in ```/frontend/src/app```:
- Modular component design:
  - ```file-list```, ```file-detail```, ```user-meta```, ```loading-spinner```, ```page-header```, ```toast```, ```sidebar```
- AuthGuard + AuthService integrate with Cognito
- Uses ```api.service.ts``` for backend API calls
- Secure CloudFront-hosted frontend
- WebSocket support included (```websocket.service.ts```)

---

To create given stack with CloudFormation use:
- ```
  aws cloudformation create-stack \
    --stack-name <stack-name> \
    --template-body file://<stack-file-name>.yaml \
    --profile <your-profile> \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameters ParameterKey=Environment,ParameterValue=<env>
  ```
- or
  ```
  ./cloudformation/script/
      create-buckets-stack.sh
      create-get-user-image-metadata-stack.sh
      create-get-user-metadata-stack.sh
      create-list-user-images-stack.sh
      create-metadata-consuer-stack.sh
      create-oidc-provider.sh
      create-queue-stack.sh
      create-upload-stack.sh
  ```

---

### CI/CD

Automated deployment of individual Lambda functions to S3 and AWS Lambda using GitHub Actions and OIDC-based authentication — no long-lived AWS credentials needed.

- ### Key Features of the Workflow Setup
  - ##### Authentication
    - OIDC (OpenID Connect) is used via:
      ```
        permissions:
          id-token: write
          contents: read
      ```
  - ##### Secure AWS access via aws-actions/configure-aws-credentials@v4 using:
    - role-to-assume stored securely as a GitHub Secret (AWS_ARN_ROLE_OIDC_PROVIDER)
    - No hardcoded credentials or secrets
  - ##### Packaging & Deployment Steps
    - Trigger: 
      - Manual via workflow_dispatch
    - Steps:
      - Checkout Code
      - Zip Python Lambda source code
      - Upload to S3
      - Update Lambda Function Code
    - Environment Variables
      - Each workflow defines:
        - ```AWS_REGION```
        - ```S3_BUCKET_NAME```
        - ```ZIP_FILE_NAME```
        - ```LAMBDA_FUNCTION_NAME```
  - ##### Security Practices Followed
    - Least privilege IAM roles (via role-to-assume)
    - Sensitive data like ARNs managed via GitHub Secrets
    - No inline AWS keys or tokens
  - ##### Key considerations
    - Fast updates: Trigger a redeploy on-demand per Lambda function
    - Modular & Isolated: Each Lambda has its own workflow — avoids interdependency issues
    - Scalable: New Lambda functions can be added by copying a workflow and adjusting env variables
    - Cloud-native best practices: Uses AWS-native S3-based Lambda code deployment
    - Secure: Uses federated credentials via GitHub OIDC

---

### Create user

An AdminGroup is created by CloudFormation.

To create user use below aws-cli cmd:
```
aws cognito-idp admin-create-user \
--user-pool-id <pool-id> \
--username user@example.com \
--user-attributes Name=email,Value=user@example.com \
--desired-delivery-mediums EMAIL \
--profile <your-profile>   #aws-cli config

Sample response:
{
    "User": {
        "Username": "...",
        "Attributes": [
            {
                "Name": "email",
                "Value": "example@brighthills.com"
            },
            {
                "Name": "sub",
                "Value": "..."
            }
        ],
        "UserCreateDate": "2025-...",
        "UserLastModifiedDate": "2025-06...",
        "Enabled": true,
        "UserStatus": "FORCE_CHANGE_PASSWORD"
    }
}
```