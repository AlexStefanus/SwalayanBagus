

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Product } from '@types-shared';
import { useProducts } from '../contexts/ProductContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const HomePage: React.FC = () => {
  const { products: allProducts, isLoading, getProductCategories } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  
  const productCategories = getProductCategories(); 
  const query = useQuery();
  const searchTerm = query.get('search');

  useEffect(() => {
    let productsToFilter = allProducts;

    if (searchTerm) {
        productsToFilter = productsToFilter.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (selectedCategory === "Semua") {
      setFilteredProducts(productsToFilter);
    } else {
      setFilteredProducts(productsToFilter.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, allProducts, searchTerm]);

  if (isLoading && allProducts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size="h-16 w-16" color="text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-800 mb-2 text-center">
        {searchTerm ? `Hasil Pencarian untuk "${searchTerm}"` : "Produk Unggulan"}
      </h1>
       {searchTerm && filteredProducts.length > 0 && (
          <p className="text-center text-neutral-600 mb-6">{filteredProducts.length} produk ditemukan.</p>
       )}
      
      <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
        {productCategories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150
              ${selectedCategory === category 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-neutral-500 py-10">
            {searchTerm ? `Tidak ada produk ditemukan untuk "${searchTerm}"` : `Tidak ada produk ditemukan di kategori "${selectedCategory}".`}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;