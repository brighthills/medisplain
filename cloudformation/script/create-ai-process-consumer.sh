#!/bin/bash

aws cloudformation update-stack \
  --stack-name bagalyze-file-ai-process-consumer \
  --template-body file://10-ai-process-consumer-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
