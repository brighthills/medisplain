# Bagalyze

---
The project currently contains a CloudFormation stack file that creates the below enlisted resources under #Architecture section.
To run CloudFormation stack file against a desired AWS Account env, aws-cli should be set-up in you local environment where the repository exists.

To run the stack file:
```
aws cloudformation create-stack \
  --stack-name bagalyze-upload-gateway \
  --template-body file://1-upload-stack.yaml \
  --profile <your-profile> \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=Environment,ParameterValue=dev
```

---

### Architecture
- Cognito
  - UserPool to allow email/password authentication
  - Users can be defined with aws-cli cmd integration after UserPool creation
    - email upon creation
    - password policy
    - account recovery mechanism (email verification)
- ApiGateway
  - api with ```upload``` resource with POST method
  - ApiGateway Authorizer to connect the Cognito UserPool
  - an stage deployment namely ```dev```
- Lambda
  - execution IAM role for PutObject, CreateLogGroup, CreateLogStream, PutLogEvents
  - in-line function to handle image upload
  - api permission to enable ApiGateway call
- S3
  - bucket to have the pictures stored upon upload

---

### Cognito

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
        "Username": "83540892-30d1-70d8-7f6f-bd58638bed1e",
        "Attributes": [
            {
                "Name": "email",
                "Value": "dbagyon@brighthills.com"
            },
            {
                "Name": "sub",
                "Value": "83540892-30d1-70d8-7f6f-bd58638bed1e"
            }
        ],
        "UserCreateDate": "2025-06-16T12:03:52.298000+02:00",
        "UserLastModifiedDate": "2025-06-16T12:03:52.298000+02:00",
        "Enabled": true,
        "UserStatus": "FORCE_CHANGE_PASSWORD"
    }
}
```

To get client related data:
```
aws cognito-idp list-user-pool-clients \
  --user-pool-id eu-central-1_gjnSiQMax \
  --max-results 60 \
  --profile <your-profile>   #aws-cli config
  
 {                                                                                                                                                                                                                                                                                        
    "UserPoolClients": [
        {
            "ClientId": "4orpudnql4vbvsu2gdvsvqqrku",
            "UserPoolId": "eu-central-1_gjnSiQMax",
            "ClientName": "restricted-client"
        }
    ]
}
```



