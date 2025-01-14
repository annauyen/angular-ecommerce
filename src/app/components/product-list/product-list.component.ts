import { Component, inject, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { ProductComponent } from './product/product.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatButtonModule,
    ProductComponent,
    NgFor,
    NgIf,
    MatPaginatorModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId = 1;
  previousCategoryId = 1;
  searchMode = false;

  pageNumber = 1;
  pageSize = 10;
  totalElements = 0;

  // Sorting order state
  sortByPriceAsc = true; // true for ascending, false for descending
  sortByNameAsc = true;

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getListProducts();
    });
  }
  getListProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(keyword).subscribe((data) => {
      this.products = data;
    });
  }

  handleListProducts() {
    const categoryId = this.route.snapshot.paramMap.get('id');
    this.currentCategoryId = categoryId ? parseInt(categoryId) : 1;

    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService
      .getProductsPaginate(
        this.pageNumber - 1,
        this.pageSize,
        this.currentCategoryId
      )
      .subscribe((data) => {
        this.products = data._embedded.products;
        this.pageNumber = data.page.number + 1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.handleListProducts();
    console.log(this.pageSize);
    console.log(event.pageSize);
  }

  onAddToCart(product: Product) {
    console.log('added: ' + product.name);
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
    this.cartService.logCartData();
  }

  // Sorting by Price (toggle between ascending and descending)
  sortByPrice() {
    this.sortByPriceAsc = !this.sortByPriceAsc; // Toggle the sorting order
    this.products = [...this.products].sort((a, b) =>
      this.sortByPriceAsc
        ? a.unitPrice - b.unitPrice
        : b.unitPrice - a.unitPrice
    );
  }

  // Sorting by Name (toggle between ascending and descending)
  sortByName() {
    this.sortByNameAsc = !this.sortByNameAsc; // Toggle the sorting order
    this.products = [...this.products].sort((a, b) =>
      this.sortByNameAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }
}
