import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn = false;

  constructor(private router: Router) {
    const token = localStorage.getItem('accessToken');
    this.isLoggedIn = !!token;
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login-redirect']);
  }
}
