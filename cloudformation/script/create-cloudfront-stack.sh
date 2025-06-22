#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-cloudfront \
  --template-body file://13-cloudfront-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
