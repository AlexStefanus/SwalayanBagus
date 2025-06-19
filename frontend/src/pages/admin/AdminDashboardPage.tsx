import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner'; 

const AdminDashboardPage: React.FC = () => {
  const { currentUser, orders, isLoading: authLoading } = useAuth(); 
  const { products, isLoading: productsLoading } = useProducts();

  const pendingOrders = orders.filter(order => order.status === 'Tertunda').length;

  
  const pageIsLoading = authLoading || productsLoading;

  if (pageIsLoading && (!currentUser || products.length === 0 || orders.length === 0)) { 
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Dasbor Admin</h1>
      <p className="text-neutral-700 mb-6">Selamat datang kembali, {currentUser?.firstName || currentUser?.username || 'Admin'}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-neutral-100">
          <h2 className="text-lg font-semibold text-primary mb-2">Total Produk</h2>
          <p className="text-3xl font-bold text-neutral-700">{productsLoading && products.length === 0 ? <LoadingSpinner size="h-6 w-6"/> : products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-neutral-100">
          <h2 className="text-lg font-semibold text-primary mb-2">Total Pesanan</h2>
          <p className="text-3xl font-bold text-neutral-700">{authLoading && orders.length === 0 ? <LoadingSpinner size="h-6 w-6"/> : orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-neutral-100">
          <h2 className="text-lg font-semibold text-primary mb-2">Pesanan Tertunda</h2>
          <p className="text-3xl font-bold text-neutral-700">{authLoading && orders.length === 0 ? <LoadingSpinner size="h-6 w-6"/> : pendingOrders}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Tindakan Cepat</h3>
        <div className="flex space-x-4">
            <Link to="/admin/products/new" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
                Tambah Produk Baru
            </Link>
            <Link to="/admin/orders" className="bg-neutral-200 text-neutral-700 py-2 px-4 rounded-md hover:bg-neutral-300 transition-colors">
                Lihat Semua Pesanan
            </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;