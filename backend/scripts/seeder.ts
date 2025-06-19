import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import UserModel from '../src/models/userModel.js';
import ProductModel from '../src/models/productModel.js';
import OrderModel from '../src/models/orderModel.js';
import { User, Product, Order } from '@types-shared';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) throw new Error("MONGO_URI tidak ditemukan");
        await mongoose.connect(mongoUri);
        console.log('MongoDB Terhubung untuk Seeder...');
    } catch (error: any) {
        console.error(`Error Seeder: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
  try {
    await connectDB();

    await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    await UserModel.deleteMany();
    
    const dbPath = path.resolve(process.cwd(), '../frontend/db.json');
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    const usersToInsert = data.users.map((user: User & { id: string }) => {
        const { id, ...rest } = user;
        return rest;
    });
    await UserModel.create(usersToInsert);
    
    const productsToInsert = data.products.map((product: Product & { id: string }) => {
        const { id, ...rest } = product;
        return rest;
    });
    const createdProducts = await ProductModel.insertMany(productsToInsert);

    const oldIdToNewIdMap = new Map();
    createdProducts.forEach((product, index) => {
        const oldId = data.products[index].id;
        oldIdToNewIdMap.set(oldId, product._id);
    });

    const ordersToInsert = data.orders.map((order: any) => {
        const newItems = order.items.map((item: any) => {
            const { id, ...itemRest } = item;
            const newProductId = oldIdToNewIdMap.get(id);
            return { ...itemRest, product: newProductId };
        });
        
        const { id, ...orderRest } = order;
        return { ...orderRest, items: newItems };
    });
    await OrderModel.insertMany(ordersToInsert);


    console.log('Migrasi Data Selesai! Semua data berhasil diimpor dan terhubung dengan benar.');
    process.exit();
  } catch (error) {
    console.error(`Error saat impor data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    try {
        await connectDB();
        await OrderModel.deleteMany();
        await ProductModel.deleteMany();
        await UserModel.deleteMany();
        console.log('Data berhasil dihapus!');
        process.exit(1);
    } catch (error) {
        console.error(`Error saat hapus data: ${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}