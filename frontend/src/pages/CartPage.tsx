import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '@/constants';
import QuantityInput from '../components/QuantityInput';
import TrashIcon from '../components/TrashIcon';
import { CartItem } from '@types-shared';
import { useAuth } from '../contexts/AuthContext';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const item = cart.find(p => p.id === productId);
    if (item) {
      if (newQuantity > item.stock) {
        alert(`Stok tidak mencukupi. Stok tersisa: ${item.stock}`);
        updateQuantity(productId, item.stock);
      } else {
        updateQuantity(productId, newQuantity);
      }
    }
  };
  
  const totalPrice = getTotalPrice();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">Keranjang Belanja</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-neutral-600">Keranjang Anda masih kosong.</p>
          <Link to="/" className="mt-4 inline-block bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            <ul className="divide-y divide-neutral-200">
              {cart.map((item: CartItem) => (
                <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-md object-cover mr-4" />
                    <div>
                      <h3 className="text-base font-medium text-neutral-800">{item.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-28">
                      <QuantityInput
                        quantity={item.quantity}
                        onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                      />
                    </div>
                    <p className="w-24 text-right font-medium text-neutral-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {!isAdmin && (
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
                <h2 className="text-xl font-semibold mb-4">Ringkasan</h2>
                <div className="flex justify-between text-neutral-600 mb-2">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-neutral-800 mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <Link to="/checkout" className="w-full mt-6 bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors font-semibold text-lg flex items-center justify-center">
                  Lanjut ke Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;