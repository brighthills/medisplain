#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-secret-creator \
  --template-body file://11-secret-creator-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=test \
      ParameterKey=OpenAISecretString,ParameterValue=<the-secret>
