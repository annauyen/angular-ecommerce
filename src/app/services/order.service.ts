import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Order } from '../models/order';
import { OrderStatus } from '../models/purchase';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders'; // Backend URL

  constructor(private http: HttpClient) {}

  // Fetch all orders
  getAllOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(this.apiUrl);
  }

  updateStatus(id: string, status: OrderStatus): Observable<any> {
    return this.http.post(this.apiUrl + "/" + id + "/status", { status });
  }
}

