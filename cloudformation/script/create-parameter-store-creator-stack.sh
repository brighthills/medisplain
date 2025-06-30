#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-prod-parameter-store-creator \
  --template-body file://14-parameter-store-creator-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
    --parameters file://params/openai-params.json