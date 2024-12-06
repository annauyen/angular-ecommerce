import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CurrencyPipe, NgFor } from '@angular/common';
import { Product } from '../../../models/product';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    CurrencyPipe,
    NgFor
  ],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss'
})
export class ProductManagementComponent {
  private productService = inject(ProductService)
  private dialog = inject(MatDialog)
  private cdr = inject(ChangeDetectorRef)

  displayedColumns: string[] = ['id', 'name', 'unitPrice', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.dataSource.data = data.reverse();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onAddOrUpdateProduct(product?: Product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '400px',
      data: product
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Product data:', result);
        this.addOrUpdateProduct(result)
      }
    });

  }

  addOrUpdateProduct(newProduct: Product): void {
    // Check if the product exists in the list by ID
    console.log("asodjisaojdisaod")
    console.log(newProduct)
    const existingIndex = this.dataSource.data.findIndex((p) => p.id === newProduct.id);

    if (existingIndex !== -1) {
      // If product exists, update it
      this.dataSource.data = this.dataSource.data.map(item =>
        item.id === newProduct.id ? { ...newProduct } : item
      );
    } else {
      // If product doesn't exist, add it to the top of the list
      this.dataSource.data = [newProduct, ...this.dataSource.data];
    }
  }

  onDeleteProduct(id: string) {
    const confirmDeletion = confirm('Are you sure you want to delete this product?');
    if (confirmDeletion) {
      this.productService.deleteProduct(id).subscribe(res => {
        this.dataSource.data = this.dataSource.data.filter(item => item.id !== res.id);
      })
    }
  }
}
