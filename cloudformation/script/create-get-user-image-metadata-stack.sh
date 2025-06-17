#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-get-user-image-metadata \
  --template-body file://08-get-user-image-metadata-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
