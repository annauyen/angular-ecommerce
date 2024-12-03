import { NgIf } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { UserInfoServicesService } from '../../services/user-info.services.service';

@Component({
  selector: 'app-login-status',
  standalone: true,
  imports: [NgIf, RouterLink, MatButton],
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.scss',
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  private oktaAuth = inject(OKTA_AUTH);
  private oktaAuthService = inject(OktaAuthStateService);
  private userInfoService = inject(UserInfoServicesService);

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.userInfoService.updateIsAuthenticated(result.isAuthenticated!);
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
        }
      );
    }
  }

  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();
  }
}
