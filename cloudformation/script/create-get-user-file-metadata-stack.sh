#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-prod-get-user-file-metadata \
  --template-body file://08-get-user-file-metadata-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=prod \
      ParameterKey=Origin,ParameterValue=https://medisplain.brighthills.cloud