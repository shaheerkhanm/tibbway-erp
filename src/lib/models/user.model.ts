
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { User } from '@/lib/types';

export interface IUser extends Omit<User, '_id'>, Document {
  password?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['Super Admin', 'Admin', 'Staff'], required: true, default: 'Staff' },
  avatar: { type: String },
});

const UserModel = (models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
