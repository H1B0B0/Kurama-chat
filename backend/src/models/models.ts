// models.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  _id: String,
});

const messageSchema = new mongoose.Schema({
  text: String,
  roomId: String,
  userId: String,
});

export const Room = mongoose.model("Room", roomSchema);
export const Message = mongoose.model("Message", messageSchema);
