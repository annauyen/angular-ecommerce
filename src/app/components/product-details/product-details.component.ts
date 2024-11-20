import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgModel } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatIcon],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product: Product = {} as Product;

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }
  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe((data) => {
      this.product = data;
    });
  }

  quantity: number = 0;

  increment() {
    this.quantity++;
  }

  addToCart() {
    console.log(
      `Adding to cart: ${this.product.name}, ${this.product.unitPrice}`
    );
    const cartItem = new CartItem(this.product, this.quantity);
    this.cartService.addToCart(cartItem);
  }
}
