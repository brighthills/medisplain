#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-cloudfront \
  --template-body file://13-cloudfront-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev \
      ParameterKey=KeyGroupId,ParameterValue=2d6165bf-7c19-4a58-b983-c4c27343b99c
