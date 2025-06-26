#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-get-user-file-metadata \
  --template-body file://08-get-user-file-metadata-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev \
      ParameterKey=Origin,ParameterValue=http://localhost:4200
