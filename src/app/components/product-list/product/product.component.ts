import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models/product';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIcon, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  // @Input({ required: true }) name!: string;
  // @Input({ required: true }) description!: string;
  // @Input({ required: true }) price!: string;
  // @Input({ required: true }) linkToDetail!: string;
  // @Input({ required: true }) id!: string;
  @Input({ required: true }) product!: Product;
  @Output() selectedProduct = new EventEmitter<Product>();
  // @Input({ required: true }) image!: string;

  addToCart(product: Product) {
    this.selectedProduct.emit(product);
  }
}
