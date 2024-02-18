import { Schema, model, Document, Model } from "mongoose";

interface ISingleUser extends Document {
  username: string;
  socketId: string;
}

interface ISingleUserModel extends Model<ISingleUser> {
  findAll(): Promise<ISingleUser[]>;
  findOneByUsername(socketId: string): Promise<ISingleUser | null>;
}

const singleUserSchema = new Schema<ISingleUser>({
  username: { type: String, required: true, unique: true },
  socketId: { type: String, required: true },
});

singleUserSchema.statics.findAll = function (): Promise<ISingleUser[]> {
  return this.find().exec();
};

singleUserSchema.statics.findOneByUsername = function (
  socketId: string
): Promise<ISingleUser | null> {
  return this.findOne({ socketId }).exec();
};

export const SingleUser = model<ISingleUser, ISingleUserModel>(
  "SingleUser",
  singleUserSchema
);
