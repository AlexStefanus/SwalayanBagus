import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { CartItem, Product } from '@types-shared';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartKey = currentUser ? `cartSwalayanBagus_${currentUser.id}` : null;

  useEffect(() => {
    if (cartKey) {
      try {
        const item = window.localStorage.getItem(cartKey);
        if (item) {
          setCart(JSON.parse(item));
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error('Gagal memuat keranjang dari localStorage:', error);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [cartKey]); 
  useEffect(() => {
    if (cartKey) {
      try {
        window.localStorage.setItem(cartKey, JSON.stringify(cart));
      } catch (error) {
        console.error('Gagal menyimpan keranjang ke localStorage:', error);
      }
    }
  }, [cartKey, cart]); 

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: (Number(item.quantity) || 0) + (Number(quantity) || 0) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const parsedQuantity = Number(newQuantity) || 0;
    if (parsedQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: parsedQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  };
  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};