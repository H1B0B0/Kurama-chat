import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  text: string;
  roomId: string;
  userId: string;
}

const messageSchema = new mongoose.Schema({
  text: String,
  roomId: { type: String, ref: "Room" }, // Reference to Room
  userId: { type: String, ref: "User" }, // Reference to User
});

export const Message = mongoose.model("Message", messageSchema);
