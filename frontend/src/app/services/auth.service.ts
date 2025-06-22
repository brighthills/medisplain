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
    localStorage.setItem('accessToken', res.id_token);

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
