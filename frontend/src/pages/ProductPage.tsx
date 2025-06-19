import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '@types-shared';
import LoadingSpinner from '../components/LoadingSpinner';
import QuantityInput from '../components/QuantityInput';
import { formatCurrency } from '@/constants';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { products, isLoading } = useProducts();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isLoading) return;
    if (productId) {
      const foundProduct = products.find(p => p.id === productId);
      setProduct(foundProduct || null);
    }
  }, [productId, products, isLoading]);

  useEffect(() => {
    if (!isLoading && product === null) {
      navigate('/404');
    }
  }, [product, isLoading, navigate]);
  
  const handleAddToCart = () => {
    if (!currentUser) {
      alert('Anda harus masuk untuk menambahkan produk ke keranjang.');
      navigate('/login');
      return;
    }
    if (product) {
      addToCart(product, quantity);
      alert(`${quantity} "${product.name}" berhasil ditambahkan ke keranjang!`);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product) {
      if (newQuantity < 1) {
        setQuantity(1);
      } else if (newQuantity > product.stock) {
        setQuantity(product.stock);
      } else {
        setQuantity(newQuantity);
      }
    }
  };
  
  if (isLoading || !product) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size="h-16 w-16" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          <div className="w-full aspect-square bg-neutral-50 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800">{product.name}</h1>
            <div className="mt-3">
              <p className="text-3xl text-primary font-bold">{formatCurrency(product.price)}</p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-neutral-500">
                Kategori: <span className="font-medium text-neutral-700">{product.category}</span>
              </p>
              <p className="text-sm text-neutral-500">
                Stok Tersedia: <span className="font-medium text-neutral-700">{product.stock}</span>
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-neutral-800 mb-2">Deskripsi Produk</h3>
              <div 
                className="text-base text-neutral-600 space-y-4 whitespace-pre-line" 
                dangerouslySetInnerHTML={{ __html: product.description }} 
              />
            </div>

            <div className="mt-8">
              <div className="flex items-center space-x-4">
                <div className="w-32">
                  <label htmlFor="quantity" className="sr-only">Kuantitas</label>
                  <QuantityInput
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAdmin}
                  className="flex-1 bg-primary border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:bg-neutral-400 disabled:cursor-not-allowed"
                >
                  {isAdmin ? 'Masuk untuk membeli' : product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;