#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-upload-gateway \
  --template-body file://1-upload-stack.yaml \
  --profile bh \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=Environment,ParameterValue=dev