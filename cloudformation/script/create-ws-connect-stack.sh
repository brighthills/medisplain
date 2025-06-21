#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-ws-connect-handler \
  --template-body file://11-ws-connect-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
