#!/bin/bash

aws cloudformation update-stack \
  --stack-name medisplain-static-site \
  --template-body file://18-static-site-stack.yaml \
  --profile bh-us \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev
