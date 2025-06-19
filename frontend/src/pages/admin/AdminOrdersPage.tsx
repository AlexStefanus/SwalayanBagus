import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { OrderStatus, OrderItem } from '@types-shared';
import { formatCurrency } from '@/constants';
import { format, isValid } from 'date-fns';
import { id } from 'date-fns/locale';
import LoadingSpinner from '../../components/LoadingSpinner';

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const AdminOrdersPage: React.FC = () => {
  const { orders, isLoading, updateOrderStatus } = useAuth();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'Semua'>('Semua');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    if (filterStatus === 'Semua') return orders;
    return orders.filter(order => order.status === filterStatus);
  }, [orders, filterStatus]);

  const handleToggleExpand = (orderId: string) => {
    setExpandedOrderId(currentId => (currentId === orderId ? null : orderId));
  };

  const statusOptions: (OrderStatus | 'Semua')[] = ['Semua', 'Tertunda', 'Diproses', 'Dikemas', 'Dikirim', 'Terkirim', 'Dibatalkan'];
  
  const statusColorMap: { [key in OrderStatus]: string } = {
    'Tertunda': 'bg-yellow-100 text-yellow-800', 'Diproses': 'bg-blue-100 text-blue-800',
    'Dikemas': 'bg-indigo-100 text-indigo-800', 'Dikirim': 'bg-purple-100 text-purple-800',
    'Terkirim': 'bg-green-100 text-green-800', 'Dibatalkan': 'bg-red-100 text-red-800',
  };

  const formatDate = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    return isValid(date) ? format(date, 'd MMM yy, HH:mm', { locale: id }) : 'Tanggal tidak valid';
};

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Pesanan</h1>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(status => (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filterStatus === status ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Detail</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => handleToggleExpand(order.id)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.orderDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)} onClick={(e) => e.stopPropagation()} className={`w-full p-2 rounded-md border-none focus:ring-0 ${statusColorMap[order.status]}`}>
                        {statusOptions.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-primary">
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                        </button>
                    </td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr className="bg-neutral-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-sm text-gray-700 mb-2">Detail Produk</h4>
                                <ul className="divide-y divide-gray-200">
                                    {order.items.map((item: OrderItem) => (
                                        <li key={item.product} className="py-2 flex justify-between">
                                            <div className="flex items-center">
                                                <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Jumlah: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{formatCurrency(item.price * item.quantity)}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-700 mb-2">Alamat Pengiriman</h4>
                                <address className="not-italic text-sm text-gray-600">
                                    <strong>{order.shippingAddress.fullName}</strong><br/>
                                    {order.shippingAddress.addressLine1}<br/>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                </address>
                                <h4 className="font-bold text-sm text-gray-700 mb-2">Metode Pembayaran</h4>
                                <p className="text-sm text-gray-800 font-medium bg-gray-200 px-3 py-1 rounded-md inline-block">{order.paymentMethod}</p>
                            </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    Tidak ada pesanan dengan status "{filterStatus}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;