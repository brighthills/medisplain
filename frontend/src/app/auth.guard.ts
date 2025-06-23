import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../enviroments/env';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  const email = localStorage.getItem('email');
  const url = state.url;

  if (url.includes('/callback')) {
    return true;
  }

  if (token && email) {
    return true;
  }

  const loginStarted = window.location.href.includes('code=');
  if (loginStarted && !email) {
    alert('We could not retrieve your login information. Please log in again.');
    window.location.href =
      `${environment.cognito.domain}/login` +
      `?client_id=${environment.cognito.clientId}` +
      `&response_type=code` +
      `&scope=email+openid+phone` + 
      `&redirect_uri=${environment.cognito.redirectUri}`; return false;
  }

  router.navigate(['/login-redirect']);
  return false;
};
