import { Request, Response } from 'express';
import UserModel from '../models/userModel.js';

const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, firstName, lastName, phone } = req.body;
  const userExists = await UserModel.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    res.status(400).json({ message: 'Pengguna sudah terdaftar' });
    return;
  }
  const user = await UserModel.create({ username, email, password, firstName, lastName, phone, role: 'customer' });
  if (user) {
    res.status(201).json({ message: 'Pendaftaran berhasil' });
  } else {
    res.status(400).json({ message: 'Data pengguna tidak valid' });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  const user = await UserModel.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select('+password');
  if (user && (await user.matchPassword(password))) {
    const userObject = user.toObject();
    delete userObject.password;
    res.json(userObject);
  } else {
    res.status(401).json({ message: 'Email/Username atau password salah' });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
    const users = await UserModel.find({});
    res.json(users);
}

export { registerUser, loginUser, getAllUsers };