export const environment = {
  production: false,
  cognito: {
    domain: 'https://medisplain-dev.auth.eu-central-1.amazoncognito.com',
    clientId: '7m1pnpl86ss6seqtjq945qpe3r',
    redirectUri: 'http://localhost:4200/callback',
    logOutUri: 'http://localhost:4200/logout',
    responseType: 'code',
  },
  api: {
    uploadUrl: 'https://7ew6twes9f.execute-api.eu-central-1.amazonaws.com/dev/upload',
    filesUrl: 'https://7ew6twes9f.execute-api.eu-central-1.amazonaws.com/dev/files',
    fileUrl: 'https://7ew6twes9f.execute-api.eu-central-1.amazonaws.com/dev/download',
    userMetaUrl: 'https://7ew6twes9f.execute-api.eu-central-1.amazonaws.com/dev/user',
    fileDetail: 'https://7ew6twes9f.execute-api.eu-central-1.amazonaws.com/dev/file-meta',
    webSocketBaseUrl: 'wss://igr9mytqu6.execute-api.eu-central-1.amazonaws.com/dev/',
  }
};
