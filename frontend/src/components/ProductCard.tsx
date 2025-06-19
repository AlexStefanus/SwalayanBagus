import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@types-shared';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!currentUser) {
      alert('Anda harus masuk untuk menambahkan produk ke keranjang.');
      navigate('/login');
      return;
    }
    addToCart(product, 1);
    alert(`"${product.name}" telah ditambahkan ke keranjang!`);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl group border border-neutral-100">
      <Link to={`/product/${product.id}`} className="block overflow-hidden h-40 bg-white flex items-center justify-center">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow"> 
        <p className="text-xs text-neutral-500 mb-1">{product.category}</p> 
        <Link to={`/product/${product.id}`} className="block flex-grow">
          <h3 className="text-sm font-semibold text-neutral-800 group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-bold text-primary mt-2 mb-3">{formatCurrency(product.price)}</p> 
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdmin}
            className="w-full bg-primary-light text-primary py-2 px-3 text-sm font-bold rounded-md hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
          >
            {isAdmin ? 'Masuk untuk membeli' : product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;