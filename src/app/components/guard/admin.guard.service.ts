import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { UserInfoServicesService } from '../../services/user-info.services.service';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { from, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate{
  private userInforService = inject(UserInfoServicesService);
  private adminRole = 'admin'

  constructor() { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.userInforService.getUserInfo().pipe(map(data => {
      return data.profile.userType === this.adminRole
    }))
  }
}
