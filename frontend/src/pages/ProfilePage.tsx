import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading || !currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md border border-neutral-200">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Profil Saya</h1>
        <p className="text-neutral-500 mb-6">Kelola informasi akun Anda di sini.</p>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="font-medium text-neutral-600">Nama Pengguna</span>
            <span className="text-neutral-800">{currentUser.username}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="font-medium text-neutral-600">Email</span>
            <span className="text-neutral-800">{currentUser.email}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="font-medium text-neutral-600">Nama Lengkap</span>
            <span className="text-neutral-800">{`${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="font-medium text-neutral-600">Telepon</span>
            <span className="text-neutral-800">{currentUser.phone || '-'}</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
            <Link 
                to="/profile/orders"
                className="w-full text-center block bg-primary-light text-primary font-medium py-3 px-4 rounded-md hover:bg-primary-dark hover:text-white transition-colors"
            >
                Lihat Riwayat Pesanan
            </Link>
            <button
                onClick={handleLogout}
                className="w-full bg-neutral-100 text-neutral-700 font-medium py-3 px-4 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
            >
                Keluar
            </button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;