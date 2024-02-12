import mongoose, { Document, Schema } from "mongoose";

export interface IRooms extends Document {
  _id: { type: String; default: "1" };
  name: String;
  userId: { type: String; ref: "User" };
}

const roomSchema = new mongoose.Schema({
  _id: { type: String, default: "1" },
  name: String,
  userId: { type: String, ref: "User" },
});

export const Room = mongoose.model("Room", roomSchema);
