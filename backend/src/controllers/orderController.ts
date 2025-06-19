import { Request, Response } from 'express';
import OrderModel from '../models/orderModel.js';
import ProductModel from '../models/productModel.js';
import { CartItem } from '@types-shared';

const addOrderItems = async (req: Request, res: Response) => {
    const { userId, customerName, items, totalPrice, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        res.status(400).json({ message: 'Tidak ada barang dalam pesanan' });
        return;
    }
    
    if (!paymentMethod || !['QRIS', 'COD'].includes(paymentMethod)) {
        res.status(400).json({ message: 'Metode pembayaran tidak valid.' });
        return;
    }

    try {
       for (const item of items as CartItem[]) {
            const product = await ProductModel.findById(item.id);

            if (!product) {
                return res.status(404).json({ message: `Produk dengan nama "${item.name}" tidak ditemukan.` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Stok untuk produk "${product.name}" tidak mencukupi. Sisa stok: ${product.stock}` });
            }

            product.stock -= item.quantity;
            await product.save();
        }

        const orderItems = items.map((item: CartItem) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            imageUrl: item.imageUrl,
            product: item.id 
        }));
        
        const newOrder = new OrderModel({
            userId,
            customerName,
            items: orderItems,
            totalPrice,
            shippingAddress,
            paymentMethod,
            orderDate: new Date()
        });

        const createdOrder = await newOrder.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error('Gagal saat membuat pesanan:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat memproses pesanan.' });
    }
};

const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await OrderModel.find({}).sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Gagal memuat pesanan:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (updatedOrder) {
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error saat memperbarui status pesanan:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

export { addOrderItems, getOrders, updateOrderStatus };