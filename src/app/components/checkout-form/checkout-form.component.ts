import { CommonModule, CurrencyPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {
  UserInformation,
  UserInfoServicesService,
} from '../../services/user-info.services.service';
import { OktaAuthStateService } from '@okta/okta-angular';
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
    NgIf,
  ],
  templateUrl: './checkout-form.component.html',
  styleUrl: './checkout-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutFormComponent implements OnInit {
  checkoutForm: FormGroup;
  totalQuantity = 0;
  totalPrice = 0;
  cartItems: CartItem[] = [];
  isAuthenticated = false;
  userInfo = {} as UserInformation;
  private oktaAuthService = inject(OktaAuthStateService);

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private router: Router,
    private checkoutService: CheckoutService,
    private userInfoService: UserInfoServicesService
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],

      address: ['', [Validators.required, Validators.minLength(10)]],

      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expirationDate: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
          this.expirationDateValidator(),
        ],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }
  ngOnInit(): void {
    this.reviewCartDetails();
    this.cartItems = this.cartService.cartItems;
    // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
    });
    this.userInfoService.getUserInfo().subscribe((userInfo) => {
      this.userInfo = userInfo;
      this.checkoutForm.patchValue({
        fullName: userInfo.profile.firstName + ' ' + userInfo.profile.lastName,
        email: userInfo.profile.email,
      });
    });
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
      productName: tempCartItem.name,
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

  readonly dialog = inject(MatDialog);

  // Open confirmation dialog
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.onSubmit();
      }
    });
  }
  expirationDateValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }

      const [month, year] = control.value
        .split('/')
        .map((val: string) => parseInt(val, 10));
      if (!month || !year) {
        return null;
      }

      const currentDate = new Date();
      const inputDate = new Date(Number(`20${year}`), month); // YY to 20YY

      if (inputDate < currentDate) {
        return { expired: true };
      }

      return null;
    };
  }
}
