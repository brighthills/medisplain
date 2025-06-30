#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-prod-ws-connect-handler \
  --template-body file://09-ws-connect-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=prod