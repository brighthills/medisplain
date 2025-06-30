#!/bin/bash

aws cloudformation update-stack \
  --stack-name medisplain-prod-list-user-files \
  --template-body file://07-list-user-files-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=prod \
      ParameterKey=Origin,ParameterValue=https://medisplain.brighthills.cloud