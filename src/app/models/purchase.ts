import { Address } from './address';
import { Customer } from './customer';
import { Order } from './order';
import { OrderItem } from './order-item';

export interface Purchase {
  customer: Customer;
  address: Address;
  order: Order;
  orderItems: OrderItem[];
}

export enum OrderStatus {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED"
}
