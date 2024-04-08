export interface Product {
  id: number;
  name: string;
  price: number;
  code: string;
  quantity: number;
  category_name: string;
  img: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  info: string[];
}

export interface ApiResponse {
  rows: Product[];
  сount: number;
}

export interface Payload {
  rows: Product[];
  count: number;
}
