import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Order, ShippingAddress, CartItem, OrderStatus, LoginCredentials, RegisterData, PaymentMethod } from '@types-shared';
import useLocalStorage from '../hooks/useLocalStorage';
import * as authService from '../services/authService';
import * as orderService from '../services/orderService';

interface AuthContextType {
  currentUser: User | null;
  orders: Order[];
  isLoading: boolean;
  loginError: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  addOrder: (userId: string, customerName: string, items: CartItem[], totalPrice: number, shippingAddress: ShippingAddress, paymentMethod: PaymentMethod) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  fetchOrders: () => void;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storedUser, setStoredUser] = useLocalStorage<User | null>('currentUserSwalayanBagus', null);
  const [currentUser, setCurrentUser] = useState<User | null>(storedUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const ordersData = await orderService.getOrders();
      setOrders(ordersData);
    } catch(error) {
      console.error("Gagal fetch orders:", error);
    } finally {
        setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    setCurrentUser(storedUser);
    if(storedUser) {
        fetchOrders();
    } else {
        setIsLoading(false);
    }
  }, [storedUser, fetchOrders]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const userFound = await authService.login(credentials);
      setStoredUser(userFound);
      setCurrentUser(userFound);
    } catch (error: any) {
      setLoginError(error.message);
      throw error;
    } finally {
        setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    await authService.register(userData);
    alert("Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.");
  };

  const logout = () => {
    setStoredUser(null);
    setCurrentUser(null);
    setOrders([]);
    setLoginError(null);
  };

  const addOrder = async (userId: string, customerName: string, items: CartItem[], totalPrice: number, shippingAddress: ShippingAddress, paymentMethod: PaymentMethod) => {
    const newOrder = await orderService.addOrder(userId, customerName, items, totalPrice, shippingAddress, paymentMethod);
    fetchOrders();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => (o.id === orderId ? updatedOrder : o)));
  };

  return (
    <AuthContext.Provider value={{ currentUser, orders, isLoading, loginError, login, register, logout, addOrder, updateOrderStatus, fetchOrders }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};