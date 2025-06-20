#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-list-user-files \
  --template-body file://07-list-user-files-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
