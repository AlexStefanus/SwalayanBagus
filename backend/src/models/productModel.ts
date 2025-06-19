import mongoose from 'mongoose';
import { Product } from '@types-shared';

const productSchema = new mongoose.Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  }
});

const ProductModel = mongoose.model<Product>('Product', productSchema);
export default ProductModel;