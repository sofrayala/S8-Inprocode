import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../../auth/data-access/auth-service.service';

const routerInjection = () => inject(Router);

const authService = () => inject(AuthServiceService);

export const authGuard: CanActivateFn = async () => {
  const router = routerInjection();

  const { data } = await authService().session();

  if (!data.session) {
    router.navigateByUrl('/log-in');
  }
  console.log(!!data.session);

  return !!data.session;
};

export const publicGuard: CanActivateFn = async () => {
  const router = routerInjection();

  const { data } = await authService().session();

  if (data.session) {
    router.navigateByUrl('/');
  }

  return !data.session;
};
