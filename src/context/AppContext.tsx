import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { CartItem, Order, Product, Size } from '../types';

type CheckoutInput = {
  customerName: string;
  phone: string;
  city: string;
  address: string;
};

type AppContextType = {
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product, size: Size) => void;
  increaseQty: (productId: string, size: Size) => void;
  decreaseQty: (productId: string, size: Size) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  placeOrder: (input: CheckoutInput) => Order;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (product: Product, size: Size) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id && item.size === size);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { product, size, quantity: 1 }];
    });
  };

  const increaseQty = (productId: string, size: Size) => {
    setCart((current) =>
      current.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQty = (productId: string, size: Size) => {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart],
  );

  const placeOrder = (input: CheckoutInput) => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      customerName: input.customerName,
      phone: input.phone,
      city: input.city,
      address: input.address,
      paymentMethod: 'Cash on Delivery',
      items: cart,
      total: cartTotal,
      status: 'Pending',
      createdAt: new Date().toLocaleString(),
    };

    setOrders((current) => [order, ...current]);
    setCart([]);
    return order;
  };

  const value = {
    cart,
    orders,
    addToCart,
    increaseQty,
    decreaseQty,
    clearCart,
    cartCount,
    cartTotal,
    placeOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
}
