import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminLayout: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/login');
    setIsLoggingOut(false);
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Produk', path: '/admin/products' },
    { name: 'Pesanan', path: '/admin/orders' },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          <p className="text-sm text-neutral-500">{currentUser?.email}</p>
        </div>
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-neutral-700 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'hover:bg-neutral-100 hover:text-neutral-900'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-neutral-200">
           <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center px-4 py-2 text-neutral-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? <LoadingSpinner size="h-5 w-5" /> : 'Keluar'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;