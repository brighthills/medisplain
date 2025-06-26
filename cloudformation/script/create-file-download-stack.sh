#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-file-download \
  --template-body file://13-file-download-stack.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=test \
      ParameterKey=CloudFrontKeyPairId,ParameterValue=K2XJMN1YQSUXRJ \
      ParameterKey=CloudFrontPrivateKeySecretName,ParameterValue=arn:aws:secretsmanager:eu-central-1:447923164625:secret:cloudfront-private-key-ghsuW4
