export const environment = {
  production: false,
  cognito: {
    domain: 'https://bagalyze.auth.eu-central-1.amazoncognito.com',
    clientId: '6m4ujlmkkrjud4n3fr6ul3tiel',
    redirectUri: 'http://localhost:4200/callback',
    responseType: 'code',
  },
  api: {
    uploadUrl: 'https://poyqoedorf.execute-api.eu-central-1.amazonaws.com/dev/upload',
    filesUrl: 'https://poyqoedorf.execute-api.eu-central-1.amazonaws.com/dev/files',
    userMetaUrl: 'https://poyqoedorf.execute-api.eu-central-1.amazonaws.com/dev/user',
    webSocketUrl: '`wss://a9iwmgn508.execute-api.eu-central-1.amazonaws.com/dev/?email=${encodeURIComponent(email)}`', 
  }
};
