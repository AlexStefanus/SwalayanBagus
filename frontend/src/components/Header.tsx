import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { CartItem } from '@types-shared';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const totalItems = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center text-xl font-bold text-primary">
              <img src="/images/icon.png" alt="Swalayan Bagus Logo" className="h-8 mr-2" />
              <span className="hidden sm:inline">SwalayanBagus</span>
            </Link>
          </div>
          
          <div className="flex-1 flex justify-center px-2">
            <SearchBar />
          </div>

          <div className="flex items-center justify-end">
            <Link to="/cart" className="relative p-2 text-neutral-600 hover:text-primary transition-colors">
              <span className="sr-only">Lihat Keranjang</span>
              <FiShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="ml-2 sm:ml-4 relative">
              {currentUser ? (
                <div>
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="sr-only">Buka menu pengguna</span>
                    <FiUser size={24} className="text-neutral-600 hover:text-primary"/>
                  </button>
                  {isMenuOpen && (
                    <div 
                      onMouseLeave={() => setIsMenuOpen(false)}
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    >
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm">Masuk sebagai</p>
                        <p className="text-sm font-medium text-neutral-900 truncate">{currentUser.username}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Profil Anda</Link>
                        <Link to="/profile/orders" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Riwayat Pesanan</Link>
                        {currentUser.role === 'admin' && (
                          <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Dasbor Admin</Link>
                        )}
                      </div>
                      <div className="py-1 border-t">
                        <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                          <FiLogOut className="mr-2" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-primary">
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;