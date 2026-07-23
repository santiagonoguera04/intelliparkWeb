import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';

import { provideHttpClient, withInterceptors  } from '@angular/common/http';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { authInterceptorFn } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Captura errores globales del navegador
    provideZonelessChangeDetection(), // Detección de cambios sin Zone.js
    provideRouter(routes), // Registra el sistema de rutas - Importante
    provideHttpClient(
      withInterceptors([authInterceptorFn])
    ) // Permite hacer peticiones HTTP.
  ]
};
