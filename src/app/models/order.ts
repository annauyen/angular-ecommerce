import { Address } from './address';
import { Customer } from './customer';
import { OrderItem } from './order-item';

export interface Order {
  totalQuantity: number;
  totalPrice: number;
  orderTrackingNumber?: string;
  status?: string;
  dateCreated?: Date;
  lastUpdated?: Date;
  orderItems?: OrderItem[];
  customer?: Customer;
  address?: Address;
  _links?: {
    self: { href: string };
    order: { href: string };
    customer: { href: string };
  };
}
