import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
  name: string;
  username: string;
  password: string;
  isAdmin?: boolean;
  status: 'offline' | 'online';
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'offline',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<User>('User', UserSchema);
