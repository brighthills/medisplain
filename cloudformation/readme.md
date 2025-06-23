## Manual interventions

### CloudFrontKeyPairId and KeyGroupId creation
To ```s3://bagalyze-buckets-security-dev/rsa/cloudfront-private-key.pem``` upload a private-key.
```
openssl genrsa -out private.pem 2048
```

Get the public key from it.
```
ssh-keygen -f private.pem -y > public.pub
```

CloudFront >> Key Management >> Public Keys >> Create New

CloudFront >> Key Management >> Key groups >> Create New

Therefore, ```14-file-download-stack.yaml``` and ```13-cloudfront-stack.yaml``` can be run successfully.


### Cognito managed login

After Cognito creation, goto Cognito >> Branding >> Managed login and create a Style. In Cognito >> Branding >> Domain >> Edit Cognito domain branding version >> switch to Managed login




