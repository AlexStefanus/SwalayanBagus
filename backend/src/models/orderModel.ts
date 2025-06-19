import mongoose, { Document } from 'mongoose';
import { Order, OrderItem as SharedOrderItem, ShippingAddress } from '@types-shared'; 

export interface OrderDocument extends Omit<Order, 'id'>, Document {}

interface MongooseOrderItem extends Omit<SharedOrderItem, 'product'> {
    product: mongoose.Schema.Types.ObjectId;
}

const orderItemSchema = new mongoose.Schema<MongooseOrderItem>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, {
    _id: false 
});

const shippingAddressSchema = new mongoose.Schema<ShippingAddress>({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
});

const orderSchema = new mongoose.Schema<OrderDocument>({
  userId: { type: String, required: true },
  customerName: { type: String, required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['QRIS', 'COD'],
  },
  status: {
    type: String,
    required: true,
    enum: ['Tertunda', 'Diproses', 'Dikemas', 'Dikirim', 'Terkirim', 'Dibatalkan'],
    default: 'Tertunda',
  },
  orderDate: { type: Date, required: true, default: Date.now },
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

const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
export default OrderModel;