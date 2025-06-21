import { Routes } from '@angular/router';
import { authGuard } from './auth.guard'; // ez legyen legfelül!

export const routes: Routes = [
  {
    path: 'login-redirect',
    loadComponent: () =>
      import('./components/login-redirect/login-redirect.component').then((m) => m.LoginRedirectComponent),
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('./components/callback/callback.component').then((m) => m.CallbackComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'files',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/file-list/file-list.component').then((m) => m.FileListComponent),
  },
  {
    path: 'user-meta',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/user-meta/user-meta.component').then((m) => m.UserMetaComponent),
  }

];
