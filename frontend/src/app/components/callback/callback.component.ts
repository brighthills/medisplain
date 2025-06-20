import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/env';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `<p>Bejelentkezés folyamatban...</p>`,
})
export class CallbackComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

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
        console.log('✅ Token válasz:', res);

        if (res.access_token) {
          localStorage.setItem('accessToken', res.access_token);  // 🛠️ FONTOS: id_token
          this.router.navigate(['/']);
        } else {
          console.error('❌ Nincs accessToken a válaszban.');
          alert('Bejelentkezés sikertelen.');
        }
      },
      error: (err) => {
        console.error('❌ Hiba a token lekérésnél:', err);
        alert('Bejelentkezés sikertelen.');
      },
    });
  }
}
