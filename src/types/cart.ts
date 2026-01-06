// src/types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'deal';
  image?: string;
  productId?: string;
  dealId?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}