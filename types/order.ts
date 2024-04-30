import { Product } from "./product";

export type OrderItem = {
  product: Product;
  color: string;
  size: string;
  amount: number;
};

export type Order = {
  id: number;
  orderItem: OrderItem[];
};
