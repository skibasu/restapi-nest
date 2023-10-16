export enum PaymentType {
  CARD = 'CARD',
  ONLINE = 'ONLINE',
  CASH = 'CASH',
  PAYED = 'PAYED',
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  OPEN = 'OPEN',
  DONE = 'DONE',
  SELECTED = 'SELECTED',
}

export enum MenuProductType {
  PIZZA = 'PIZZA',
  DRINKS = 'DRINKS',
  OTHERS = 'OTHERS',
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  picture: string;
  type: MenuProductType;
  counter: number;
}
