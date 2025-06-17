# Bagalyze

Secure and efficient serverless system for uploading user images, storing metadata, and retrieving user-specific data using AWS services like Cognito, Lambda, API Gateway, S3, SQS, and DynamoDB.

---

### Infrastructure and Architecture Built:
- ##### User Authentication with Cognito
  - Cognito User Pool for secure, managed user identity
  - Pre-sign-up Lambda to automatically store basic user info in DynamoDB
  - Admin-only user creation using AdminCreateUser
  - Email verification & password policies enforced
  - Cognito User Pool Client with ALLOW_ADMIN_USER_PASSWORD_AUTH
- ##### Data Storage with DynamoDB
  - A single-table design:
  ```
        User info:
            PK = user@example.com, SK = info
        User images:
            PK = user@example.com, SK = image#filename.jpg
        Metadata includes: filename, userId, userEmail, createdAt, uploadTimestamp.
  ```
- ##### Lambda Functions
  - ```PreSignupLambda```: Adds user metadata to DynamoDB on sign-up
  - ```UploadImageFunction```: Uploads images to S3 with custom metadata
  - ```S3 Event Consumer Lambda```: Triggered by S3 → SQS → Lambda; reads metadata and stores it in DynamoDB
  - ```GetUserMetadataFunction```: Returns metadata about the user (GET /user)
  - ```ListUserImagesFunction```: Lists all image metadata for a user (GET /images)
  - ```GetUserImageMetadataFunction```: Retrieves metadata for a specific image (GET /image-meta?filename=...)
- ##### API Gateway Integration
  - Cognito authorization enforced
  - Routes defined:
    - ```POST /upload``` → Upload image
    - ```GET /user``` → Get user info
    - ```GET /images``` → List all user images
    - ```GET /image-meta?filename=``` → Get image metadata
  - Lambda proxy integrations used for streamlined processing
- ##### Image Handling & Processing
  - Images uploaded to S3
  - Object metadata (user-id, user-email, etc.) set on upload
  - S3 sends event → SQS queue → Lambda consumes metadata → DynamoDB stores it
- #####  SQS Integration
  - ImageUploadQueue handles S3 events (ObjectCreated:Put)
  - Consumer Lambda:
    - Skips ```s3:TestEvent```
    - Extracts metadata using ```head_object```
    - Stores validated metadata into DynamoDB
  - IAM permissions configured securely for Lambda to ReceiveMessage and GetObject
- ##### Security
  - IAM roles scoped with least privilege (per Lambda)
  - S3 bucket policies allow only required services (Lambda, S3 to SQS)
  - SQS access tightly restricted by source ARN (S3)
  - API Gateway routes protected via Cognito JWT token
- ##### Automation with CloudFormation
  - Modular CloudFormation templates:
    - Cognito & API Gateway
    - S3 Buckets & IAM
    - SQS Queue
    - Lambda function stacks
  - Outputs exported/imported across stacks using Export / ImportValue.

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