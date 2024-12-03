import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { OrderItem } from '../../models/order-item';
import { Order } from '../../models/order';
import { Purchase } from '../../models/purchase';
import { Customer } from '../../models/customer';
import { Address } from '../../models/address';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    CurrencyPipe,
  ],
  templateUrl: './checkout-form.component.html',
  styleUrl: './checkout-form.component.scss',
})
export class CheckoutFormComponent implements OnInit {
  checkoutForm: FormGroup;
  totalQuantity = 0;
  totalPrice = 0;
  cartItems: CartItem[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private router: Router,
    private checkoutService: CheckoutService
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],

      address: ['', [Validators.required, Validators.minLength(10)]],

      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expirationDate: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }
  ngOnInit(): void {
    this.reviewCartDetails();
    this.cartItems = this.cartService.cartItems;
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      this.checkoutForm.markAllAsTouched();
      this.handleCheckout();
      this.snackBar.open('Checkout successful!', 'Close', {
        duration: 3000,
      });
    } else {
      this.snackBar.open(
        'Please fill in missing information in the form.',
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }

  handleCheckout() {
    let order = {
      totalPrice: this.totalPrice,
      totalQuantity: this.totalQuantity,
    };

    const cartItems = this.cartService.cartItems;

    // Map cart items to OrderItem structure
    let orderItems = cartItems.map((tempCartItem) => ({
      imageUrl: tempCartItem.imageUrl,
      quantity: tempCartItem.quantity,
      unitPrice: tempCartItem.unitPrice,
      productId: tempCartItem.id,
    }));

    // Initialize purchase object matching the backend payload
    let purchase = {
      customer: {
        fullName: this.checkoutForm.controls['fullName'].value,
        email: this.checkoutForm.controls['email'].value,
      },
      address: {
        address: this.checkoutForm.controls['address'].value, // Matches "address" in the payload
      },
      order: order,
      orderItems: orderItems,
    };

    console.log('Payload being sent:', purchase);

    // Call REST API via CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        this.snackBar.open(
          `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`,
          'Close',
          {
            duration: 3000,
          }
        );
        this.resetCart();
      },
      error: (err) => {
        console.error('Error occurred:', err);
        this.snackBar.open('There was an error, please try again.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  reviewCartDetails() {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutForm.reset();

    // navigate back to the products page
    this.router.navigateByUrl('/products');
    this.cartService.cleanSessionStorage();
  }
}
