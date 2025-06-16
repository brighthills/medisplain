#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-buckets \
  --template-body file://buckets-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=Environment,ParameterValue=dev