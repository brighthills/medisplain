export const environment = {
  production: false,
  cognito: {
    domain: 'https://medisplain-test.auth.eu-central-1.amazoncognito.com',
    clientId: '74sndk1nlo5qf411fdcp0mdh0e',
    redirectUri: 'https://medisplain.brighthills.cloud/callback',
    logOutUri: 'https://medisplain.brighthills.cloud/logout',
    responseType: 'code',
  },
  api: {
    uploadUrl: 'https://9j3fnzfz98.execute-api.eu-central-1.amazonaws.com/test/upload',
    filesUrl: 'https://9j3fnzfz98.execute-api.eu-central-1.amazonaws.com/test/files',
    fileUrl: 'https://9j3fnzfz98.execute-api.eu-central-1.amazonaws.com/test/download',
    userMetaUrl: 'https://9j3fnzfz98.execute-api.eu-central-1.amazonaws.com/test/user',
    fileDetail: 'https://9j3fnzfz98.execute-api.eu-central-1.amazonaws.com/test/file-meta',
    webSocketBaseUrl: 'wss://x4rtfzardl.execute-api.eu-central-1.amazonaws.com/test/',
  }
};
