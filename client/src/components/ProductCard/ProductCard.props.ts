export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  code: string;
  img: string;
  category_name: string;
  quantity: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  info: Info[];
}

export interface Info {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  itemId?: number;
}
