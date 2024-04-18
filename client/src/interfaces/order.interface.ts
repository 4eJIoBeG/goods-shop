export interface Order {
  id: number;
  userId: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  items: Item[];
}

export interface Item {
  id: number;
  itemId: number;
  quantity: number;
  itemDetails: ItemDetails;
}

export interface ItemDetails {
  id: number;
  name: string;
  price: number;
  code: string;
  quantity: number;
  img: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
}
