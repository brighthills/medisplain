#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-queue \
  --template-body file://02-queue-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
