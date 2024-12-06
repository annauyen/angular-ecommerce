import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../../models/cart-item';
import { CartService } from '../../../services/cart.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatList, MatListItem } from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    RouterLink,
  ],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.scss',
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  displayedColumns: string[] = [
    'productImage',
    'productDetail',
    'quantity',
    'actions',
  ];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );

    // compute cart total price and quantity
    this.cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart({ ...theCartItem, quantity: 1 });
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
    // Remove the item from the cart if its quantity becomes 0
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
    // Optionally filter out the item from the local cartItems array to immediately update the table
    this.cartItems = this.cartItems.filter(
      (item) => item.id !== theCartItem.id
    );
  }
  trackByIndex(index: string, item: CartItem): string {
    return item.id; // Or any unique identifier of the cart item
  }
}
