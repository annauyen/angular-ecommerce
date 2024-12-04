import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderStatus, Purchase } from '../models/purchase';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = 'https://103.188.82.184:8080//api/checkout/purchase';

  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    if (!purchase.order.status) {
      purchase.order.status = OrderStatus.PENDING
    }

    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

}
