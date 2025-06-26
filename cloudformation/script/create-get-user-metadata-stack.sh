#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-get-user-metadata \
  --template-body file://06-get-user-metadata-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev \
      ParameterKey=Origin,ParameterValue=http://localhost:4200
