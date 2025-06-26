#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-list-user-files \
  --template-body file://07-list-user-files-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=test
