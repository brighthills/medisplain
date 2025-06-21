import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('accessToken');
  const router = inject(Router);

  if (token) {
    return true;
  }

  router.navigate(['/login-redirect']);
  return false;
};
