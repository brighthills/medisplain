import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../enviroments/env';

function isTokenExpired(token: string): boolean {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  const email = localStorage.getItem('email');
  const url = state.url;

  // Allow the callback route without checking token
  if (url.includes('/callback')) {
    return true;
  }

  // Valid token & email present, and token is not expired
  if (token && email && !isTokenExpired(token)) {
    return true;
  }

  // Token might be missing or expired — redirect to Cognito
  const loginStarted = window.location.href.includes('code=');
  if (loginStarted && !email) {
    alert('We could not retrieve your login information. Please log in again.');
    window.location.href =
      `${environment.cognito.domain}/login` +
      `?client_id=${environment.cognito.clientId}` +
      `&response_type=code` +
      `&scope=email+openid+phone` +
      `&redirect_uri=${environment.cognito.redirectUri}`;
    return false;
  }

  // Optional: fallback redirect (if not already on Cognito)
  window.location.href =
    `${environment.cognito.domain}/login` +
    `?client_id=${environment.cognito.clientId}` +
    `&response_type=code` +
    `&scope=email+openid+phone` +
    `&redirect_uri=${environment.cognito.redirectUri}`;
  return false;
};
