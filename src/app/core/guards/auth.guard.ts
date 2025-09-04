import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};

export const roleGuard = (allowedRoles: string[]) => {
  const guard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const currentUser = authService.getCurrentUser();
    if (currentUser && allowedRoles.includes(currentUser.role)) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  };

  return guard;
};