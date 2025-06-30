#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-prod-upload-gateway \
  --template-body file://04-upload-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=prod \
      ParameterKey=Origin,ParameterValue=https://medisplain.brighthills.cloud