import { Component, inject, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import myAppConfig from '../../config/my-app-config';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit{
  oktaSignin: any;
  private oktaAuth = inject(OKTA_AUTH);
  constructor() {

    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      },
      features: {
        registration: true
      },
    });
   }

  ngOnInit(): void {
    this.oktaAuth.idx.register({
      username: "lephucloc1711@gmail.com",
      password: "Lephucloc1.",
      "email": "lephucloc1711@gmail.com"
    }).then(res => {
      console.log("helloksdoasd")
      console.log(res)
    })
    this.oktaSignin.remove();

    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'}, // this name should be same as div tag id in login.component.html
      (response: any) => {
        if (response.status === 'SUCCESS') {
          console.log("login success")
          this.oktaAuth.signInWithRedirect();
          this.oktaAuth.getUser().then(data => {
            console.log(data)
          })

        }
      },
      (error: any) => {
        throw error;
      }
    );
  }
}
