export type User = {
  index: number;
  name: string;
  phone: string;
  email: string;
  order: number[];
  cupon: Cupon[];
  point: number;
};

export type Cupon = {
  name: string;
  amount: number;
};
