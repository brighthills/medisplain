#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-list-images \
  --template-body file://07-list-user-images-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
