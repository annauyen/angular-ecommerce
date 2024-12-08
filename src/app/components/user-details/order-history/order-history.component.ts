import { Component, Input } from '@angular/core';
import { MatCardMdImage, MatCardModule } from '@angular/material/card';
import { Order } from '../../../models/order';
import { DatePipe, NgStyle } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [MatCardModule, DatePipe, NgStyle],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
})
export class OrderHistoryComponent {
  @Input({ required: true }) order!: Order;

  getTotalQuantity() {
    return this.order.orderItems?.length;
  }

  getTotalPrice() {
    return this.order.orderItems
      ?.map((item) => item.quantity * item.unitPrice)
      .reduce((partialSum, a) => partialSum + a, 0);
  }

  getStatusStyle(status: string | undefined): any {
    switch (status) {
      case 'PENDING':
        return { 'background-color': 'yellow', color: 'black' };
      case 'CANCELED':
        return { 'background-color': 'red', color: 'white' };
      case 'DELIVERED':
        return { 'background-color': 'green', color: 'white' };
      default:
        return {};
    }
  }
}
