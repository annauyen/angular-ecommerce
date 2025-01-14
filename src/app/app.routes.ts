import { Router, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart/cart-details/cart-details.component';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { OrdersComponent } from './components/admin/orders/orders.component';

import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { LoginComponent } from './components/login/login.component';
import { Injector } from '@angular/core';
import OktaAuth from '@okta/okta-auth-js';
import { MemberPageComponent } from './components/member-page/member-page.component';
import { AdminGuardService } from './components/guard/admin.guard.service';

function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  // Use injector to access any service available within your application
  const router = injector.get(Router);

  // Redirect the user to your custom login page
  router.navigate(['/auth']);
}
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AboutComponent } from './components/about/about.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AdminConsoleComponent } from './components/admin/admin-console/admin-console.component';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: LandingPageComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'checkout', component: CheckoutFormComponent },

  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'auth', component: LoginComponent },
  {
    path: 'member',
    component: MemberPageComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'admin',
    component: AdminConsoleComponent,
    loadChildren: () =>
      import('./components/admin/route').then(
        (m) => m.PROTECTED_FEATURE_ROUTES
      ),
    canActivate: [OktaAuthGuard, AdminGuardService],
  },

  { path: 'user', component: UserDetailsComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: ForbiddenComponent },
];
