import React, { useState, useEffect } from 'react';
import { useProducts } from '../../contexts/ProductContext';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProductFormPage: React.FC = () => {
  const { products, addProduct, updateProduct, getProductById, isLoading } = useProducts();
  const navigate = useNavigate();
  
  const { productId } = useParams<{ productId: string }>();
  const isEditMode = Boolean(productId);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stock: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && productId) {
      const productToEdit = getProductById(productId);
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          description: productToEdit.description,
          price: String(productToEdit.price),
          category: productToEdit.category,
          imageUrl: productToEdit.imageUrl,
          stock: String(productToEdit.stock),
        });
      }
    }
  }, [productId, isEditMode, getProductById, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const priceAsNumber = parseFloat(formData.price);
    const stockAsNumber = parseInt(formData.stock, 10);

    if (isNaN(priceAsNumber) || isNaN(stockAsNumber) || priceAsNumber < 0 || stockAsNumber < 0) {
      alert('Harga dan stok harus berupa angka positif.');
      setIsSubmitting(false);
      return;
    }

    const productDataPayload = {
      name: formData.name,
      description: formData.description,
      price: priceAsNumber,
      category: formData.category,
      imageUrl: formData.imageUrl,
      stock: stockAsNumber,
    };

    try {
      if (isEditMode && productId) {
        await updateProduct({ ...productDataPayload, id: productId });
      } else {
        await addProduct(productDataPayload);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      alert(`Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} produk. Silakan coba lagi.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading && isEditMode) {
      return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-neutral-100 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">
        {isEditMode ? 'Ubah Produk' : 'Tambah Produk Baru'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Nama Produk</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
        </div>

        <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-700">Kategori</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Deskripsi</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={4} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-neutral-700">Harga</label>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-neutral-700">Stok</label>
            <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700">URL Gambar</label>
          <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
        </div>
        
        {formData.imageUrl && (
            <div className="mt-4">
                <p className="block text-sm font-medium text-neutral-700 mb-2">Pratinjau Gambar</p>
                <img src={formData.imageUrl} alt="Pratinjau" className="w-32 h-32 object-cover rounded-md border" />
            </div>
        )}

        <div className="flex justify-end pt-4 gap-4">
          <button type="button" onClick={() => navigate('/admin/products')} className="bg-neutral-100 text-neutral-700 py-2 px-4 rounded-md hover:bg-neutral-200 transition-colors">
            Batal
          </button>
          <button type="submit" disabled={isSubmitting} className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark disabled:bg-neutral-400 flex items-center">
            {isSubmitting ? <LoadingSpinner size="h-5 w-5" /> : (isEditMode ? 'Simpan Perubahan' : 'Tambah Produk')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;