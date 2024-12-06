import { Route } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { ProductManagementComponent } from './product-management/product-management.component';

export const PROTECTED_FEATURE_ROUTES: Route[] = [
  { path: 'orders', component: OrdersComponent },
  { path: 'products', component: ProductManagementComponent },
];
