import { ProductCategory } from './../../../../models/product-category';
import { Component, Inject, Input, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { ProductService } from '../../../../services/product.service';
import { map } from 'rxjs';
import { Product } from '../../../../models/product';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    AsyncPipe
  ],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss'
})
export class ProductDialogComponent implements OnInit{
  productForm: FormGroup;

  categories = this.productService.getProductCategories().pipe(map(items => items.map(item => {
    return {
      name: item.categoryName,
      id: item.id
    }
  })));

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public product: Product,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      name: [this.product ? this.product.name : '', [Validators.required]],
      description: [this.product ? this.product.description : '', [Validators.required]],
      unitPrice: [this.product ? this.product.unitPrice : null, [Validators.required, Validators.min(0)]],
      imageUrl: [this.product ? this.product.imageUrl : '', [Validators.required]],
      active: [this.product ? this.product.active : true],
      unitsInStock: [this.product ? this.product.unitsInStock : null, [Validators.required, Validators.min(0)]],
      category: [this.product && this.product.category ? this.product.category.id : null, Validators.required]
    });
    console.log("asdojasoidjois")
    console.log(this.product)
    console.log(this.productForm.value)
  }
  ngOnInit(): void {
    if (this.product) {
      this.http.get<ProductCategory>(this.product._links.category.href).subscribe(res => {
        this.productForm.patchValue({
          category: res.id
        })
      })
    }
  }

  onSave(): void {
    if (this.productForm.valid) {
      const request = {
        ...this.productForm.value,
        category: "/productCategories/" + this.productForm.value.category
      }
      if (this.product) {
        this.productService.updateProduct(this.product.id, request).subscribe(res => {
          this.dialogRef.close(res);
        })
      } else {
        this.productService.createProduct(request).subscribe(res => {
          this.dialogRef.close(res);
        })
      }
    }
  }
}
