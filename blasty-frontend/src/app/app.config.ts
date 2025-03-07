import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export let appConfig: ApplicationConfig;
appConfig = {
  providers: [provideHttpClient(withInterceptors([AuthInterceptor]))],
};
