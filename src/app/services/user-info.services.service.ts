import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable, of, ReplaySubject, switchMap } from 'rxjs';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';

export interface UserInformation {
  id: string,
  profile: {
    firstName: string,
    lastName: string,
    userType: string,
    login: string,
    email: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoServicesService {
  private apiUrl = environment.oktaApiURL + '/api/v1/users/';
  private apiKey = environment.oktaAPIKey
  private userInformation: ReplaySubject<UserInformation> = new ReplaySubject<UserInformation>();;
  private isAuthenticated = false;
  private oktaAuth = inject(OKTA_AUTH);
  private oktaAuthService = inject(OktaAuthStateService);


  constructor(private http: HttpClient) {
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        if (this.isAuthenticated) {
          from(this.oktaAuth.getUser()).pipe(
            switchMap(user => this.getUserInformationByUserId(user.sub))
          ).subscribe(data => {
            this.userInformation.next(data)
          })
        }
      }
    );
  }

  getUserInformationByUserId(userId: String): Observable<UserInformation> {
    return this.http.get<UserInformation>(this.apiUrl + userId, {
      headers: {
        'Authorization': this.apiKey,
      }
    })
  }

  getUserInfo(): Observable<UserInformation>{
    return this.userInformation
  }

  updateIsAuthenticated(isAuthen: boolean) {
    this.isAuthenticated = isAuthen;
  }
}
