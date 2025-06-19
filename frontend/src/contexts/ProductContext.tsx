import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@types-shared';
import * as productService from '../services/productService';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (productData: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductCategories: () => string[];
  fetchProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    await productService.addProduct(productData);
    fetchProducts();
  };

  const updateProduct = async (productData: Product) => {
    await productService.updateProduct(productData);
    fetchProducts();
  };

  const deleteProduct = async (productId: string) => {
    await productService.deleteProduct(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProductById = (id: string): Product | undefined => products.find(p => p.id === id);

  const getProductCategories = (): string[] => {
    if (products.length === 0) return ["Semua"];
    const categories = new Set(products.map(p => p.category));
    return ["Semua", ...Array.from(categories).sort()];
  };

  return (
    <ProductContext.Provider value={{ products, isLoading, error, addProduct, updateProduct, deleteProduct, getProductById, getProductCategories, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};