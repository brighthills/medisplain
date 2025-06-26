#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-file-ai-process-consumer \
  --template-body file://15-ai-process-consumer-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=test
