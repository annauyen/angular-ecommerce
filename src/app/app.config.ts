import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpBackend, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { OktaAuth } from '@okta/okta-auth-js';

import {
  OKTA_CONFIG,
  OktaAuthConfigService,
  OktaAuthModule,
  OktaConfig
} from '@okta/okta-angular';

import myAppConfig from './config/my-app-config';
import { tap, take, of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

const oktaConfig = myAppConfig.oidc;


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      OktaAuthModule.forRoot({
        oktaAuth: new OktaAuth(oktaConfig)
      })
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),
  ],
};
