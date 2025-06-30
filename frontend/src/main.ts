import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpLoadingInterceptor } from './app/interceptors/http-loading.interceptor';
import { LoadingService } from './app/services/loading.service';
import { environment } from './enviroments/env';


const currentUrl = window.location.pathname;
const isCallback = currentUrl.includes('/callback'); // vagy: .startsWith('/callback')
const token = localStorage.getItem('accessToken');

// engedjük továbbmenni, ha a callback route-on vagyunk!
if (token || isCallback) {
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(withInterceptorsFromDi()),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpLoadingInterceptor,
        multi: true,
      },
      LoadingService,
    ],
  }).then(() => {
    document.body.classList.remove('pre-auth');
  });
} else {
  const { domain, clientId, redirectUri, responseType } = environment.cognito;
  const loginUrl = `${domain}/login?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}`;
  window.location.href = loginUrl;
}

