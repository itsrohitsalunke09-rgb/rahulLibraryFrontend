import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const roles = route.data['roles'] as Role[];
    const role = this.auth.role();
    if (role && roles.includes(role)) {
      return true;
    }
    return this.router.parseUrl('/app/catalog');
  }
}
