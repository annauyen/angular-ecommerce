import { Component } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';

import { MatTable, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CurrencyPipe, NgIf, MatTable, NgFor, MatTableModule, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  orders: Order[] = [];
  isLoading = true;
  // Define the columns that will be displayed
  displayedColumns: string[] = [
    'orderTrackingNumber',
    'totalQuantity',
    'totalPrice',
    'status',
    'dateCreated',
    'customerName',
    'address',
    'orderItems',
  ];
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Load orders from the backend
  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        console.log('order: ', this.orders);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      },
    });
  }
}
