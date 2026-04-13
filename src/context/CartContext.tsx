'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import type { CartItemLocal, Product } from '@/types/database';

interface CartContextType {
  items: CartItemLocal[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'freshmart_cart';

function getLocalCart(): CartItemLocal[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items: CartItemLocal[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    async function fetchCart() {
      if (user) {
        const { data } = await supabase
          .from('cart_items')
          .select('*, product:products(*)')
          .eq('user_id', user.id);

        if (!cancelled && data) {
          const cartItems: CartItemLocal[] = data.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            product: item.product as unknown as Product,
          }));
          setItems(cartItems);
          setLocalCart(cartItems);
        }
      } else if (!cancelled) {
        setItems(getLocalCart());
      }
      if (!cancelled) setLoading(false);
    }

    fetchCart();

    return () => { cancelled = true; };
  }, [user, supabase]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    const existingIndex = items.findIndex((item) => item.product_id === product.id);

    let newItems: CartItemLocal[];
    if (existingIndex >= 0) {
      newItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [...items, { product_id: product.id, quantity, product }];
    }

    setItems(newItems);
    setLocalCart(newItems);

    if (user) {
      const existing = items[existingIndex];
      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('user_id', user.id)
          .eq('product_id', product.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({ user_id: user.id, product_id: product.id, quantity });
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    const newItems = items.filter((item) => item.product_id !== productId);
    setItems(newItems);
    setLocalCart(newItems);

    if (user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const newItems = items.map((item) =>
      item.product_id === productId ? { ...item, quantity } : item
    );
    setItems(newItems);
    setLocalCart(newItems);

    if (user) {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);
    }
  };

  const clearCart = async () => {
    setItems([]);
    setLocalCart([]);

    if (user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product.sale_price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
