import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <img src="https://picsum.photos/seed/404errorred/400/300" alt="Robot Tersesat" className="w-64 h-auto mb-8 rounded-lg shadow-lg"/>
      <h1 className="text-5xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Oops! Halaman Tidak Ditemukan</h2>
      <p className="text-neutral-700 mb-8 max-w-md">
        Halaman yang Anda cari mungkin telah dihapus, namanya diubah,
        atau sementara tidak tersedia.
      </p>
      <Link
        to="/"
        className="bg-primary text-white py-3 px-8 rounded-md text-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFoundPage;