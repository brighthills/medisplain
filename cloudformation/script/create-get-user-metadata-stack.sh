#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-prod-get-user-metadata \
  --template-body file://06-get-user-metadata-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=prod \
      ParameterKey=Origin,ParameterValue=https://medisplain.brighthills.cloud