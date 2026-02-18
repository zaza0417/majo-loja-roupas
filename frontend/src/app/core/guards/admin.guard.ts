import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Simple admin gate: requires user to be authenticated.
// If not, redirects to login preserving the intended URL.
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();

  if (auth.isAuthenticated() && role && role.includes('ADMIN')) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { redirect: state.url } });
  return false;
};
