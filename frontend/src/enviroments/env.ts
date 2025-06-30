export const environment = {
  production: false,
  cognito: {
    domain: 'https://<cognito-domain-name>.auth.eu-central-1.amazoncognito.com',
    clientId: '<cognito-app-client-id>',
    redirectUri: '<domain>',
    responseType: 'code',
  },
  api: {
    uploadUrl: 'https://<id-api-gtwy>.execute-api.eu-central-1.amazonaws.com/<stage>/upload',
    filesUrl: 'https://<id-api-gtwy>.execute-api.eu-central-1.amazonaws.com/<stage>/files',
    fileUrl: 'https://<id-api-gtwy>.execute-api.eu-central-1.amazonaws.com/<stage>/download',
    userMetaUrl: 'https://<id-api-gtwy>.execute-api.eu-central-1.amazonaws.com/<stage>/user',
    fileDetail: 'https://<id-api-gtwy>.execute-api.eu-central-1.amazonaws.com/<stage>/file-meta',
    webSocketBaseUrl: 'wss://<id-api-gtwy>.execute-api.eu-central-1.amazonaws.com/<stage>/',
  }
};
