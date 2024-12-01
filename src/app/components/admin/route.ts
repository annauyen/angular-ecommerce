import { Route } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';

export const PROTECTED_FEATURE_ROUTES: Route[] = [
  { path: 'orders', component: OrdersComponent },
]
