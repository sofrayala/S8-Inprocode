import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../../auth/data-access/auth-service.service';

const routerInjection = () => inject(Router);

const authService = () => inject(AuthServiceService);

export const authGuard: CanActivateFn = async () => {
  const router = routerInjection();

  const { data } = await authService().session();

  if (!data.session) {
    return router.createUrlTree(['/log-in']);
  }

  return true;
};

export const publicGuard: CanActivateFn = async () => {
  const router = routerInjection();
  const { data } = await authService().session();

  if (data.session) {
    return router.createUrlTree(['/']);
  }

  return true;
};
