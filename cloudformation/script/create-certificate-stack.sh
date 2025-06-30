#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-prod-domain-cert \
  --template-body file://16-certificate-stack.yaml \
  --profile bh-us \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=Environment,ParameterValue=prod