import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: String,
});

const roomSchema = new mongoose.Schema({
  _id: String,
  userId: { type: String, ref: "User" }, // Reference to User
});

const messageSchema = new mongoose.Schema({
  text: String,
  roomId: { type: String, ref: "Room" },
  userId: { type: String, ref: "User" },
  timestamp: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
export const Room = mongoose.model("Room", roomSchema);
export const Message = mongoose.model("Message", messageSchema);
