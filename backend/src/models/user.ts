import { Schema, model, Document, Model } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  userId: string;
}

interface IUserModel extends Model<IUser> {
  findAll(): Promise<IUser[]>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

userSchema.statics.findAll = function (): Promise<IUser[]> {
  return this.find().exec();
};

userSchema.statics.findOneByEmail = function (
  email: string
): Promise<IUser | null> {
  return this.findOne({ email }).exec();
};

export const User = model<IUser, IUserModel>("User", userSchema);
