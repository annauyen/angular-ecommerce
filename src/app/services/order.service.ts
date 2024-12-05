import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Order } from '../models/order';
import { OrderStatus } from '../models/purchase';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'https://103.188.82.184:8443/api/orders'; // Backend URL

  private orders$: Observable<Order[]> = null as unknown as Observable<Order[]>;

  constructor(private http: HttpClient) {}

  // Fetch all orders
  getOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(this.apiUrl);
  }

  updateStatus(id: string, status: OrderStatus): Observable<any> {
    return this.http.post(this.apiUrl + "/" + id + "/status", { status });
  }

  getAllOrders(): Observable<Order[]>{
    if (this.orders$ === null) {
      this.orders$ = this.getOrders();
    }

    return this.orders$;
  }

  getOrdersByEmail(email: string): Observable<Order[]> {
    return this.http
      .get<Order[]>(this.apiUrl, {
        params: {
          email
        }
      });
  }
}

