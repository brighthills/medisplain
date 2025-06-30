#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-prod-file-metadata-consumer \
  --template-body file://05-metadata-consumer-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=prod