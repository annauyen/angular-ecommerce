import { ProductCategory } from './product-category';

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  active: boolean;
  unitsInStock: number;
  dateCreated: Date;
  lastUpdated: Date;
  _links: {
    category: {
      href: string
    }
  }
}

export interface ProductRequest {
  category: string;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  active: boolean;
  unitsInStock: number;
}
