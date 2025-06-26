#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-dynamo-file-metadata-processor \
  --template-body file://10-dynamo-file-metadata-processor-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
