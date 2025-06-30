#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-prod-static-site \
  --template-body file://18-static-site-stack.yaml \
  --profile bh-us \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=prod