#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-get-user-file-metadata \
  --template-body file://08-get-user-file-metadata-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
