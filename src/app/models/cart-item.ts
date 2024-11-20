import { Product } from './product';

export class CartItem {
  id: string;
  name: string;
  imageUrl: string;
  unitPrice: number;

  quantity: number;

  constructor(product: Product, quantity: number = 1) {
    this.id = product.id.toString();
    this.name = product.name;
    this.imageUrl = product.imageUrl;
    this.unitPrice = product.unitPrice;
    this.quantity = quantity;
  }
}
