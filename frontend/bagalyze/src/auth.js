// src/auth.js
const COGNITO_DOMAIN = "https://bagalyze.auth.eu-central-1.amazoncognito.com";
const CLIENT_ID = "3k25eg9mvqg1n0flcimup7htlo";
const REDIRECT_URI = "http://localhost:4200/callback";

export function redirectToLogin() {
 const loginUrl = `${COGNITO_DOMAIN}/login?response_type=code&client_id=${CLIENT_ID}&scope=email+openid+phone&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  window.location.href = loginUrl;
}

export async function exchangeCodeForToken(code) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code: code,
    redirect_uri: REDIRECT_URI,
  });

  const res = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) throw new Error("Token exchange failed");
  return res.json();
}
