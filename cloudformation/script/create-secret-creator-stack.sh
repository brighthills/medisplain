#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-secret-creator \
  --template-body file://12-secret-creator-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
