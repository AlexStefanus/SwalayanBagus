import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const SearchBar: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?search=${keyword}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative flex items-center">
        <input
          type="text"
          name="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari produk..."
          className="w-full pl-4 pr-10 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
        <button
          type="submit"
          aria-label="Cari"
          className="absolute right-0 top-0 bottom-0 px-3 text-neutral-500 hover:text-primary transition-colors flex items-center"
        >
          <FiSearch size={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;