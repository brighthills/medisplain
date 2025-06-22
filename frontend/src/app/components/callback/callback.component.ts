import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/env';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth:AuthService) { }

  ngOnInit(): void {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      console.error('❌ Hiányzó kód az URL-ben');
      return;
    }

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', environment.cognito.clientId)
      .set('code', code)
      .set('redirect_uri', environment.cognito.redirectUri);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const tokenUrl = `${environment.cognito.domain}/oauth2/token`;

    this.http.post(tokenUrl, body.toString(), { headers }).subscribe({
      next: (res: any) => {
        console.log('✅ Token response:', res);
        this.auth.login(res);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('❌ Error retrieving token:', err);
        alert('Login failed.');
      },
    });
  }
}