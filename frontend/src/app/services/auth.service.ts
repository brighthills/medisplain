import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/env';
import { WebSocketService } from './websocket.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private webSocketService: WebSocketService,
    private userService: UserService
  ) { }

  login(res: any): void {
    // Store the access token in localStorage
    const idToken = res.id_token ?? '';
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    const email = payload?.email ?? '';
    localStorage.setItem('accessToken', idToken);
    localStorage.setItem('email', email);

    this.userService.setEmail(email);

    // Establish WebSocket connection with the token
    this.webSocketService.connect(res);
  }


  logout(): void {
    localStorage.clear();
    const logoutUrl = `${environment.cognito.domain}/logout` +
      `?client_id=${environment.cognito.clientId}` +
      `&logout_uri=http://localhost:4200/logout`; // vagy ami tényleg be van állítva
    window.location.href = logoutUrl;
  }

}
