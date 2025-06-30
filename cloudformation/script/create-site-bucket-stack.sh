#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-prod-site-bucket \
  --template-body file://17-site-bucket-stack.yaml \
  --profile bh-us \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=Environment,ParameterValue=prod