import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '@/constants';
import { format, isValid } from 'date-fns';
import { id } from 'date-fns/locale';
import { OrderStatus, OrderItem } from '@types-shared';

const OrderHistoryPage: React.FC = () => {
  const { orders, currentUser, isLoading } = useAuth();

  const userOrders = useMemo(() => {
    if (!currentUser || !Array.isArray(orders)) return [];
    return orders.filter(order => order.userId === currentUser.id)
                 .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, currentUser]);

  const statusColorMap: { [key in OrderStatus]: string } = {
    'Tertunda': 'bg-yellow-100 text-yellow-800',
    'Diproses': 'bg-blue-100 text-blue-800',
    'Dikemas': 'bg-indigo-100 text-indigo-800',
    'Dikirim': 'bg-purple-100 text-purple-800',
    'Terkirim': 'bg-green-100 text-green-800',
    'Dibatalkan': 'bg-red-100 text-red-800',
  };

  const formatDate = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    return isValid(date) ? format(date, 'd MMMM yyyy, HH:mm', { locale: id }) : 'Tanggal tidak valid';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">Riwayat Pesanan Saya</h1>
      {userOrders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-neutral-600">Anda belum memiliki riwayat pesanan.</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:text-primary-dark font-medium">
            Mulai Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => (
            <div key={order.id} className="bg-white shadow-sm rounded-lg p-6 border border-neutral-200">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="font-mono text-sm text-neutral-500">ID Pesanan: {order.id}</p>
                  <p className="text-sm text-neutral-600">{formatDate(order.orderDate)}</p>
                  <p className="text-xs text-neutral-500 mt-1">Pembayaran: <span className="font-medium text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">{order.paymentMethod}</span></p>
                </div>
                <div>
                  <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${statusColorMap[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <hr className="my-4" />
              <ul className="space-y-3">
                {order.items.map((item: OrderItem) => (
                  <li key={item.product} className="flex items-center justify-between">
                    <div className='flex items-center'>
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                      <div>
                        <p className="font-medium text-neutral-800">{item.name}</p>
                        <p className="text-sm text-neutral-500">{item.quantity} x {formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    <p className="font-medium text-neutral-900">{formatCurrency(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <hr className="my-4" />
              <div className="text-right">
                <p className="text-sm text-neutral-600">Total Pesanan</p>
                <p className="text-xl font-bold text-neutral-900">{formatCurrency(order.totalPrice)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;