import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { UserInfoServicesService } from '../../services/user-info.services.service';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { from, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate{
  private authService = inject(UserInfoServicesService);
  private oktaAuthService = inject(OktaAuthStateService);
  private oktaAuth = inject(OKTA_AUTH);
  private adminRole = 'admin'

  constructor() { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.authService.getUserInfo()) {
      const userInfo = this.authService.getUserInfo()
      return userInfo!.profile.userType === this.adminRole
    }

    return from(this.oktaAuth.getUser()).pipe(switchMap(data => {
      return this.authService.getUserInformation(data.sub)
    }), map(data => {
      return data.profile.userType === this.adminRole
    }));
  }
}
