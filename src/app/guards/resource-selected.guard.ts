import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { Resource } from "@utils/types";

export const resourceSelectedGuard: CanActivateFn = (route) => {
  const selectedResource: Resource = route.queryParams['resource'];
  const isValidResource = ['creature', 'starship'].includes(selectedResource);

  if (!isValidResource) {
    const router = inject(Router);
    router.navigate(['']);

    return false;
  }

  return true;
};
