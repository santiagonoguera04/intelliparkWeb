import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

export const authInterceptorFn: HttpInterceptorFn = (request, next) => {

  const _authService = inject(AuthService);
  const token = _authService.getToken();

  const isPublicRequest =
    request.url.includes('/auth/user-login') ||
    request.url.includes('/auth/user-register') ||
    request.url.includes('/auth/healt');

  if(!token || isPublicRequest){
    return next(request);
  }

  const authRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authRequest);
}
