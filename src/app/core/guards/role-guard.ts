import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const rolesPermitidos: string[] = route.data['roles'] ?? [];
  const rolUsuario = authService.obtenerRol();

  if (rolUsuario && rolesPermitidos.includes(rolUsuario)) {
    return true;
  }

  return router.createUrlTree(['/gamezone']);
};