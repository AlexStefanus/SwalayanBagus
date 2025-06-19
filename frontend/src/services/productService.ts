import { Product } from '@types-shared';

const API_URL = '/api/products';

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Gagal mengambil data produk dari server.');
  }
  return response.json();
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
      throw new Error('Gagal menambahkan produk.');
  }
  return response.json();
};

export const updateProduct = async (productData: Product): Promise<Product> => {
  const response = await fetch(`${API_URL}/${productData.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error('Gagal memperbarui produk.');
  }
  return response.json();
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Gagal menghapus produk.');
  }
};