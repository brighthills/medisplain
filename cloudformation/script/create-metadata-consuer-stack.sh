#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-file-metadata-consumer \
  --template-body file://05-metadata-consumer-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
