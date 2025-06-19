import React from 'react';
import { APP_NAME } from '@/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 text-neutral-500 py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. Semua hak cipta dilindungi.</p>
      </div>
    </footer>
  );
};

export default Footer;