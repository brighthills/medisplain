import { Component, OnInit } from '@angular/core';
import { environment } from '../../../enviroments/env';

@Component({
  selector: 'app-login-redirect',
  standalone: true,
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.scss']
})
export class LoginRedirectComponent implements OnInit {
  ngOnInit(): void {
      const loginUrl = `${environment.cognito.domain}/login?` +
        `client_id=${environment.cognito.clientId}` +
        `&response_type=code` +
        `&scope=email+openid+phone` +
        `&redirect_uri=${encodeURIComponent(environment.cognito.redirectUri)}`;

      window.location.href = loginUrl;
  }
}
