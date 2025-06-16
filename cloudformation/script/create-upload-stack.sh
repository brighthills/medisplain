#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-upload-gateway \
  --template-body file://003-upload-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
