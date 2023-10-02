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

export type Products = string[];
