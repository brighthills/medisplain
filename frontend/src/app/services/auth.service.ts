import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  logout(): void {
    // Clear local storage
    localStorage.removeItem('accessToken');

    // Redirect to Cognito logout
    const logoutUrl = `${environment.cognito.domain}/logout?client_id=${environment.cognito.clientId}&logout_uri=${environment.cognito.redirectUri}`;
    window.location.href = logoutUrl;
  }
}
