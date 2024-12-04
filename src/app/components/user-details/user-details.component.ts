import { Component, inject, OnInit } from '@angular/core';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { MatCard, MatCardModule } from '@angular/material/card';
import { UserInformation, UserInfoServicesService } from '../../services/user-info.services.service';
import { OrderService } from '../../services/order.service';
import { NgFor } from '@angular/common';
import { Order } from '../../models/order';
import { filter } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [OrderHistoryComponent, MatCardModule, NgFor],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit{

  private userInfoService = inject(UserInfoServicesService)
  private orderService = inject(OrderService)
  historyOrders: Order[] = [];
  userInfo: UserInformation | undefined;

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe(user => {
      this.userInfo = user;

      this.orderService.getOrdersByEmail(user.profile.email).subscribe(orders => {
        this.historyOrders = orders

      })
    })

  }

}
