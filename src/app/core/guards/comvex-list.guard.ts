import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OrganizationService } from '../services/organization.service';

export const comvexListGuard: CanActivateFn = (route, state) => {
  const organizationService = inject(OrganizationService);
  const router = inject(Router);
  const isComvex = organizationService.isComvexOrganization$.getValue();

  if (router.url.endsWith('list') && isComvex) {
    router.navigate(['../list-comvex']);
    return false;
  }

  if (router.url.endsWith('list-comvex') && !isComvex) {
    router.navigate(['../list']);
    return false;
  }

  return true;
};
