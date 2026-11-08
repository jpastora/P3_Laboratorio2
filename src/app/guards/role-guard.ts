import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string;

  if (authService.roles().includes(requiredRole)) {
    return true;
  }

  alert('No tiene permisos para acceder a esta sección');
  return router.createUrlTree(['/products']);
};
