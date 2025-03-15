import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { AuthService } from '../services/auth.service';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (authService.authStatus() === AuthStatus.authenticated) {
    return false;
  }
  
  return true;
};
