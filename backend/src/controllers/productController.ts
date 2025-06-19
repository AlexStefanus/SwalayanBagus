import { Request, Response } from 'express';
import ProductModel from '../models/productModel.js';

const getProducts = async (req: Request, res: Response) => {
  const products = await ProductModel.find({});
  res.json(products);
};

const getProductById = async (req: Request, res: Response) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
};

const createProduct = async (req: Request, res: Response) => {
  const newProduct = new ProductModel(req.body);
  const createdProduct = await newProduct.save();
  res.status(201).json(createdProduct);
};

const updateProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.findByIdAndDelete(req.params.id);
  if (product) {
    res.json({ message: 'Produk berhasil dihapus' });
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };