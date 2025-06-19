import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { ShippingAddress, CartItem, PaymentMethod } from '@types-shared';
import { formatCurrency } from '@/constants';
import Modal from '../components/Modal';

const CheckoutPage: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { currentUser, addOrder } = useAuth();
  const { fetchProducts } = useProducts();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : '',
    addressLine1: '', city: '', state: '', zipCode: '', country: 'Indonesia'
  });
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Keranjang Anda kosong.");
      return;
    }

    if (paymentMethod === 'QRIS') {
      setIsPaymentModalOpen(true);
    } else if (paymentMethod === 'COD') {
      handleFinalizeOrder('COD');
    }
  };

  const handleFinalizeOrder = async (method: PaymentMethod) => {
    setIsProcessingOrder(true);
    if (!currentUser) {
        alert("Sesi Anda berakhir, silakan login kembali.");
        setIsProcessingOrder(false);
        return;
    }
    
    try {
        const newOrder = await addOrder(
          currentUser.id,
          currentUser.username,
          cart,
          getTotalPrice(),
          shippingAddress,
          method
        );

        if (newOrder) {
          alert(`Pesanan dengan metode ${method} berhasil dibuat!`);
          fetchProducts(); 
          clearCart();
          navigate(`/profile/orders`);
        }
    } catch(err: any) {
        alert(err.message || 'Gagal membuat pesanan, silakan coba lagi.');
        console.error(err);
    } finally {
        setIsProcessingOrder(false);
        setIsPaymentModalOpen(false);
    }
  };

  const handleConfirmQrisPayment = () => {
    handleFinalizeOrder('QRIS');
  };

  const totalPrice = getTotalPrice();

  return (
    <>
      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-extrabold text-center text-neutral-800 mb-8">Checkout</h1>
          
          {cart.length === 0 ? (
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <p className="text-neutral-600">Keranjang belanja Anda kosong.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Alamat Pengiriman */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-neutral-800 mb-6">Alamat Pengiriman</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700">Nama Lengkap</label>
                      <input type="text" name="fullName" id="fullName" value={shippingAddress.fullName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="addressLine1" className="block text-sm font-medium text-neutral-700">Alamat</label>
                      <input type="text" name="addressLine1" id="addressLine1" value={shippingAddress.addressLine1} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-neutral-700">Kota</label>
                      <input type="text" name="city" id="city" value={shippingAddress.city} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-neutral-700">Provinsi</label>
                      <input type="text" name="state" id="state" value={shippingAddress.state} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700">Kode Pos</label>
                      <input type="text" name="zipCode" id="zipCode" value={shippingAddress.zipCode} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                    </div>
                  </div>
                </div>
                
                {/* Pilihan Metode Pembayaran */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-neutral-800 mb-6">Metode Pembayaran</h2>
                  <div className="space-y-4">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'QRIS' ? 'border-primary ring-2 ring-primary' : 'border-neutral-300'}`}>
                      <input type="radio" name="paymentMethod" value="QRIS" checked={paymentMethod === 'QRIS'} onChange={() => setPaymentMethod('QRIS')} className="h-4 w-4 text-primary focus:ring-primary"/>
                      <div className="ml-4">
                        <span className="font-semibold text-neutral-800">QRIS (E-Wallet, Mobile Banking)</span>
                        <p className="text-sm text-neutral-500">Bayar dengan aman menggunakan kode QR.</p>
                      </div>
                    </label>
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'COD' ? 'border-primary ring-2 ring-primary' : 'border-neutral-300'}`}>
                      <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="h-4 w-4 text-primary focus:ring-primary"/>
                      <div className="ml-4">
                        <span className="font-semibold text-neutral-800">Bayar di Tempat (COD)</span>
                        <p className="text-sm text-neutral-500">Siapkan uang pas saat kurir tiba.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Ringkasan Pesanan */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-lg shadow-md sticky top-28">
                  <h2 className="text-xl font-semibold text-neutral-800 mb-6">Ringkasan Pesanan</h2>
                  <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {cart.map((item: CartItem) => (
                        <li key={item.id} className="flex items-start justify-between">
                            <div className="flex items-center">
                                <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-md object-cover mr-3"/>
                                <div>
                                    <p className="font-medium text-neutral-800 text-sm leading-tight">{item.name}</p>
                                    <p className="text-xs text-neutral-500">x{item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-medium text-neutral-900 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                        </li>
                    ))}
                  </ul>
                  <div className="border-t border-neutral-200 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between font-semibold text-lg text-neutral-800">
                      <span>Total</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                  <button type="submit" disabled={isProcessingOrder} className="w-full mt-6 bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors font-semibold text-lg disabled:bg-neutral-400">
                    {isProcessingOrder ? 'Memproses...' : (paymentMethod === 'COD' ? 'Buat Pesanan (COD)' : 'Lanjut ke Pembayaran QRIS')}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}>
        <div className="text-center p-4">
          <h2 className="text-xl font-bold mb-4">Scan untuk Membayar</h2>
          <p className="text-neutral-600 mb-4">Total: <span className="font-bold">{formatCurrency(totalPrice)}</span></p>
          <img 
            src="/images/qris.png"
            alt="QRIS Payment" 
            className="w-64 h-64 mx-auto border-4 border-neutral-200 p-2 rounded-lg"
          />
          <p className="text-xs text-neutral-500 mt-2">Scan kode QRIS di atas menggunakan aplikasi e-wallet Anda.</p>
          <button 
            onClick={handleConfirmQrisPayment}
            disabled={isProcessingOrder}
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-semibold text-lg disabled:bg-neutral-400"
          >
            {isProcessingOrder ? 'Memproses...' : 'Saya Sudah Bayar'}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CheckoutPage;