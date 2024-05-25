// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role'];
    const isLoggedIn = this.authService.isLoggedIn();
    const userRole = this.authService.getUserRole();

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRole && expectedRole !== userRole) {
      // Redirigir a una página de "no autorizado" o similar si se desea
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
