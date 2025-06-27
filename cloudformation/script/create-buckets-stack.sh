#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-dev-buckets \
  --template-body file://03-buckets-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=Environment,ParameterValue=dev