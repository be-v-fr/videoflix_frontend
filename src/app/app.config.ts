import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AUTH_TOKEN_INTERCEPTOR } from './shared/misc/auth-token.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([AUTH_TOKEN_INTERCEPTOR]),
    ),
  ]
};
