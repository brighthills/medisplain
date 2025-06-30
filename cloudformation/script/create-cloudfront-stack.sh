#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-dev-cloudfront \
  --template-body file://12-cloudfront-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev \
      ParameterKey=KeyGroupId,ParameterValue=2d6165bf-7c19-4a58-b983-c4c27343b99c
