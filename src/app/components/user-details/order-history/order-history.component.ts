import { Component, Input } from '@angular/core';
import { MatCardMdImage, MatCardModule } from '@angular/material/card';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
})
export class OrderHistoryComponent {
  @Input({ required: true }) order!: Order;

  getTotalQuantity() {
    return this.order.orderItems?.length;
  }

  getTotalPrice() {
    return this.order.orderItems?.map(item => item.quantity * item.unitPrice).reduce((partialSum, a) => partialSum + a, 0);
  }
}
