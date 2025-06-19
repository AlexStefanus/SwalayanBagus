import { Order, OrderStatus, ShippingAddress, CartItem, PaymentMethod } from '@types-shared';

const API_URL = '/api/orders';

export const getOrders = async (): Promise<Order[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Gagal memuat data pesanan.');
    return response.json();
};

export const addOrder = async (userId: string, customerName: string, items: CartItem[], totalPrice: number, shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Promise<Order> => {
    const newOrderPayload = { userId, customerName, items, totalPrice, shippingAddress, paymentMethod };
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderPayload)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat pesanan.');
    }
    return response.json();
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
    const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Gagal memperbarui status pesanan.');
    }
    return response.json();
};