#!/bin/bash

aws cloudformation create-stack \
  --stack-name medisplain-oidc-provider \
  --template-body file://01-oidc-github-actions.yaml \
  --profile medisplain \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=GitHubOrg,ParameterValue=brighthills \
      ParameterKey=RepositoryName,ParameterValue=bagalyze \
      ParameterKey=OIDCProviderArn,ParameterValue=arn:aws:iam::447923164625:oidc-provider/token.actions.githubusercontent.com