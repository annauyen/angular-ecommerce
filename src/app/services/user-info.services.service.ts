import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { OKTA_AUTH } from '@okta/okta-angular';

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
  private userInformation: Observable<UserInformation> | null = null;
  private isAuthenticated = false;
  private oktaAuth = inject(OKTA_AUTH);

  constructor(private http: HttpClient) {}

  getUserInformationByUserId(userId: String): Observable<UserInformation> {
    return this.http.get<UserInformation>(this.apiUrl + userId, {
      headers: {
        'Authorization': this.apiKey,
      }
    })
  }

  getUserInfo(): Observable<UserInformation>{
    if (this.userInformation == null) {
      return from(this.oktaAuth.getUser()).pipe(
        switchMap(user => this.getUserInformationByUserId(user.sub))
      );
    }
    return this.userInformation
  }

  updateIsAuthenticated(isAuthen: boolean) {
    this.isAuthenticated = isAuthen;
  }
}
