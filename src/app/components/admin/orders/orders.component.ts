import { OrderStatus } from './../../../models/purchase';
import { Component } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';

import { MatTable, MatTableModule } from '@angular/material/table';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CurrencyPipe, NgIf, MatTable, NgFor, MatTableModule, DatePipe, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
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

  OrderStatus = OrderStatus;
  orderFormControl = new FormControl<OrderStatus>(OrderStatus.PENDING)
  orderStatusList: string[] = Object.values(OrderStatus);


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

  onStatusChange(order: Order, newStatus: OrderStatus): void {
    order.status = newStatus;  // Update the status in the orders array
    console.log("new status")
    console.log(newStatus)
    this.orderService.updateStatus(order.id!, newStatus).subscribe();
  }
}
