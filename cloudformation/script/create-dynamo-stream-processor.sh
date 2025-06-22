#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-dynamo-file-metadata-processor \
  --template-body file://09-dynamo-file-metadata-processor-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
