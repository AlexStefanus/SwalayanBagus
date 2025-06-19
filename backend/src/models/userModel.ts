import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '@types-shared';

export interface UserDocument extends Omit<User, 'id'>, Document {
  matchPassword(password?: string): Promise<boolean>;
}
 
const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  role: { type: String, required: true, enum: ['customer', 'admin'], default: 'customer' },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    },
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword?: string) {
  if (!this.password || !enteredPassword) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;