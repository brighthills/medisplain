#!/bin/bash

aws cloudformation create-stack \
  --stack-name bagalyze-oidc-provider \
  --template-body file://001-oidc-github-actions.yaml \
  --profile bagalyze \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=GitHubOrg,ParameterValue=brighthills \
      ParameterKey=RepositoryName,ParameterValue=bagalyze \
      ParameterKey=OIDCProviderArn,ParameterValue=arn:aws:iam::447923164625:oidc-provider/token.actions.githubusercontent.com