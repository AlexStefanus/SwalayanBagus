
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IconProps {
  className?: string;
}

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  password?: string; 
}

export interface LoginCredentials {
  identifier: string;
  password?: string;
}

export interface RegisterData extends Omit<User, 'id' | 'role' | 'password'> {
  password?: string;
}

export type OrderStatus = 'Tertunda' | 'Diproses' | 'Dikemas' | 'Dikirim' | 'Terkirim' | 'Dibatalkan';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
  product: string;
}

export type PaymentMethod = 'QRIS' | 'COD';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;  paymentMethod: PaymentMethod;
  status: OrderStatus;
  orderDate: Date;
}