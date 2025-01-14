import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';

@Component({
  selector: 'app-cart-status',
  standalone: true,
  imports: [CurrencyPipe, AsyncPipe, MatIcon, MatBadge],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.scss',
})
export class CartStatusComponent implements OnInit {
  private cartService = inject(CartService);
  totalPrice$: Subject<number> = this.cartService.totalPrice;
  totalQuantity$: Subject<number> = this.cartService.totalQuantity;

  ngOnInit(): void {
    this.cartService.init();
  }

  constructor() {
    this.cartService.init();
  }
}
