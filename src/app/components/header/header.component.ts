import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductCategory } from '../../models/product-category';
import { ProductService } from '../../services/product.service';
import { NgFor, NgIf } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { CartStatusComponent } from '../cart/cart-status/cart-status.component';
import { LoginStatusComponent } from '../login-status/login-status.component';
import { UserInfoServicesService } from '../../services/user-info.services.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,
    NgFor,
    SearchComponent,
    CartStatusComponent,
    LoginStatusComponent,
    NgIf,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  productCategories = [] as ProductCategory[];
  productService = inject(ProductService);
  isAdminUser: boolean = false;

  constructor(private userInfoService: UserInfoServicesService) {}

  isAdmin(): boolean {
    return this.isAdminUser;
  }
  ngOnInit(): void {
    this.listProductCategories();
    this.userInfoService.getUserInfo().subscribe((userInfo) => {
      this.isAdminUser = userInfo.profile.userType === 'admin';
      console.log('user info: ', userInfo);
    });
  }
  listProductCategories() {
    this.productService
      .getProductCategories()
      .subscribe((productCategories) => {
        this.productCategories = productCategories.map(
          (category: ProductCategory) => {
            return {
              ...category,
              categoryName: this.toSentenceCase(category.categoryName),
            };
          }
        );
        console.log(this.productCategories);
      });
  }
  toSentenceCase(str: string): string {
    if (!str) return str;
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
