#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-upload-gateway \
  --template-body file://04-upload-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=test
