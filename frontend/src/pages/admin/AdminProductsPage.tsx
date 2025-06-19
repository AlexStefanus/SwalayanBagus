import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { formatCurrency } from '@/constants';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProductsPage: React.FC = () => {
  const { products, isLoading, deleteProduct } = useProducts();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
      deleteProduct(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Manajemen Produk</h1>
        <Link 
          to="/admin/products/new" 
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300"
        >
          + Tambah Produk Baru
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Nama Produk</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Kategori</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Harga</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Stok</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link to={`/admin/products/edit/${product.id}`} className="text-primary hover:text-primary-dark">
                      Ubah
                    </Link>
                    <button onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:text-red-900">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;