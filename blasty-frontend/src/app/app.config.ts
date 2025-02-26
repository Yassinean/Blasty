  import { ApplicationConfig } from '@angular/core';
  import { provideRouter } from '@angular/router';
  import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
  import { routes } from './app.routes';
  import {AuthInterceptor} from "./core/interceptors/auth.interceptor";

  export let appConfig: ApplicationConfig;
  appConfig = {
    providers: [
      provideRouter(routes),
      provideHttpClient(withInterceptorsFromDi()), // Utilise les intercepteurs depuis le DI
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Ajout de l'intercepteur
    ]
  };
