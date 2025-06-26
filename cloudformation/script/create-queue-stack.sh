#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-queue \
  --template-body file://02-queue-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
