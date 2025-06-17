#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-get-user-metadata \
  --template-body file://06-get-user-metadata-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
