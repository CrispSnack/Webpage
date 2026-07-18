import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { ApiProduct } from '../types/product';

type CartItem = {
  id: string; // `${product.id}-${variant}`
  product: ApiProduct;
  variant: string;
  quantity: number;
};

interface CartContextType {
  items: CartItem[];
  addItem: (product: ApiProduct, variant: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (product: ApiProduct, variant: string, quantity = 1) => {
    setItems((prev) => {
      const existingId = `${product.id}-${variant}`;
      const existing = prev.find((item) => item.id === existingId);
      if (existing) {
        return prev.map((item) =>
          item.id === existingId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: existingId, product, variant, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id: string, quantity: number) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    );

  const clearCart = () => setItems([]);

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, cartTotal, itemCount, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
