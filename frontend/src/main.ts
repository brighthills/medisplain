import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpLoadingInterceptor } from './app/interceptors/http-loading.interceptor';
import { LoadingService } from './app/services/loading.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Provide HTTP client
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: HttpLoadingInterceptor, 
      multi: true 
    }, // Register the HTTP interceptor
    LoadingService, // Provide the LoadingService globally
  ],
});
