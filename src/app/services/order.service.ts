import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders'; // Backend URL

  constructor(private http: HttpClient) {}

  // Fetch all orders
  getAllOrders(): Observable<Order[]> {
    return this.http
      .get<GetOrdersResponse>(this.apiUrl)
      .pipe(map((response) => response._embedded.orders));
  }
}

export interface GetOrdersResponse {
  _embedded: {
    orders: Order[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
