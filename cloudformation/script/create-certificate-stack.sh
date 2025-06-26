#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-domain-cert \
  --template-body file://16-certificate-stack.yaml \
  --profile bh-us \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=Environment,ParameterValue=dev