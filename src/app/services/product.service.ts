import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Product, ProductRequest } from '../models/product';
import { GetResponse } from '../models/get-response';
import { ProductCategory } from '../models/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';
  private categoryUrl = environment.apiUrl + '/product-category';
  constructor(private http: HttpClient) {}

  getProducts(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.apiUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProductsFromResponse(searchUrl);
  }

  getAllProducts(): Observable<Product[]> {
    const searchUrl = `${this.apiUrl}`;
    return this.http
    .get<GetResponse>(searchUrl, {
      params: {
        size: 999999
      }
    })
    .pipe(map((response) => response._embedded.products));;
  }

  createProduct(req: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, req)
  }

  updateProduct(id: string, req: ProductRequest): Observable<Product> {
    return this.http.put<Product>(this.apiUrl + "/" + id, req)
  }

  deleteProduct(id: string): Observable<Product> {
    return this.http.delete<Product>(this.apiUrl + "/" + id)
  }

  getProductsPaginate(
    page: number,
    pageSize: number,
    categoryId: number
  ): Observable<GetResponse> {
    const searchUrl =
      `${this.apiUrl}/search/findByCategoryId?id=${categoryId}` +
      `&page=${page}&pageSize=${pageSize}`;

    return this.http.get<GetResponse>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http
      .get<GetResponse>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  getProductById(id: number): Observable<Product> {
    const productUrl = `${this.apiUrl}/${id}`;
    return this.http.get<Product>(productUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.apiUrl}/search/findByNameContaining?name=${keyword}`;

    return this.getProductsFromResponse(searchUrl);
  }

  private getProductsFromResponse(searchUrl: string): Observable<Product[]> {
    return this.http
      .get<GetResponse>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }
}
