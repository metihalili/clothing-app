export type Size = 'S' | 'M' | 'L' | 'XL';

export type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  sizes: Size[];
};

export type CartItem = {
  product: Product;
  size: Size;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: 'Cash on Delivery';
  items: CartItem[];
  total: number;
  status: 'Pending';
  createdAt: string;
};

export type ScreenName = 'home' | 'product' | 'cart' | 'checkout' | 'success' | 'orders';
