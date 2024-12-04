import { CartItem } from './cart-item';

export class OrderItem {
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  productId: string;
  productName: string;

  constructor(cartItem: CartItem) {
    this.imageUrl = cartItem.imageUrl;
    this.quantity = cartItem.quantity;
    this.unitPrice = cartItem.unitPrice;
    this.productId = cartItem.id;
    this.productName = cartItem.name;
  }
}
