import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new ReplaySubject<number>();
  totalQuantity: Subject<number> = new ReplaySubject<number>();

  constructor() {}

  init() {
    console.log('CartServiceCartServiceCartService');
    const a = sessionStorage.getItem('carts');
    if (a) {
      this.cartItems = JSON.parse(a) as CartItem[];
      this.computeCartTotals();
    }
    if (a === null) {
      this.cartItems = [];
      this.computeCartTotals();
    }
  }

  addToCart(cartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === cartItem.id
      )!;
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity += cartItem.quantity;
    } else {
      this.cartItems.push(cartItem);
    }
    sessionStorage.setItem('carts', JSON.stringify(this.cartItems));
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    console.log(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    console.log(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number = 0, totalQuantityValue: number = 0) {
    console.log('Contents of the cart:');
    for (let tempItem of this.cartItems) {
      const subTotalPrice = tempItem.quantity * tempItem.unitPrice;
      console.log(
        `name: ${tempItem.name}, quantity: ${tempItem.quantity}, unitPrice: ${tempItem.unitPrice}, subTotalPrice: ${subTotalPrice}`
      );
    }
    console.log(
      `total price: ${totalPriceValue.toFixed(
        2
      )}, total quantity: ${totalQuantityValue}`
    );
    console.log('---------------');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id === theCartItem.id
    );

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
    sessionStorage.setItem('carts', JSON.stringify(this.cartItems));
  }

  cleanSessionStorage() {
    sessionStorage.removeItem('carts');
  }
}
