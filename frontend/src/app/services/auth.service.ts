import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/env';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private webSocketService: WebSocketService) { }

  login(res: any): void {
    // Store the access token in localStorage
    const idToken = res.id_token ?? '';
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    const email = payload?.email ?? '';
    localStorage.setItem('accessToken', idToken);
    localStorage.setItem('email', email);

    // Establish WebSocket connection with the token
    this.webSocketService.connect(res);
  }


  logout(): void {
    // Clear local storage
    localStorage.removeItem('accessToken');

    // Redirect to Cognito logout
    const logoutUrl = `${environment.cognito.domain}/logout?client_id=${environment.cognito.clientId}&logout_uri=${environment.cognito.redirectUri}`;
    window.location.href = logoutUrl;
  }
}
