#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-secret-creator \
  --template-body file://11-secret-creator-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=test \
      ParameterKey=OpenAISecretString,ParameterValue=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
