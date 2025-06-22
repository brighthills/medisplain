#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-file-download \
  --template-body file://14-file-download-stack.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=Environment,ParameterValue=dev \
      ParameterKey=CloudFrontKeyPairId,ParameterValue=K2XJMN1YQSUXRJ \
      ParameterKey=CloudFrontPrivateKeySecretName,ParameterValue=arn:aws:secretsmanager:eu-central-1:447923164625:secret:cloudfront-private-key-ghsuW4
