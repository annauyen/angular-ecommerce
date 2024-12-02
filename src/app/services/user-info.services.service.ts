import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

interface UserInformation {
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
  private userInformation: UserInformation | null = null;
  private isAuthenticated = false;

  constructor(private http: HttpClient) {}

  getUserInformation(userId: String): Observable<UserInformation> {
    if (this.userInformation != null) {
      return of(this.userInformation)
    }
    return this.http.get<UserInformation>(this.apiUrl + userId, {
      headers: {
        'Authorization': this.apiKey,
      }
    })
  }

  getUserInfo(): UserInformation | null{
    return this.userInformation
  }

  setUserInformation(userInformation: UserInformation) {
    if (!this.userInformation) {
      this.userInformation = userInformation;
    }
  }

  getRole() {
    return this.userInformation?.profile.userType
  }

  updateIsAuthenticated(isAuthen: boolean) {
    this.isAuthenticated = isAuthen;
  }
}
