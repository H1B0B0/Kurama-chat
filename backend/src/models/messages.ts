import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  text: string;
  name: string;
  id: string;
  socketId: string;
  roomId: string;
  image?: string;
  userId: string;
  date: Date;
  systemMessage?: boolean;
}

const messageSchema = new mongoose.Schema({
  text: String,
  name: String,
  id: String,
  socketId: String,
  userId: String,
  roomId: { type: String, ref: "Room" },
  image: String,
  date: { type: Date, default: Date.now },
  systemMessage: Boolean,
});

export const Message = mongoose.model<IMessage>("Message", messageSchema);
