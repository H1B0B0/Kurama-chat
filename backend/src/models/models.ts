import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  _id: String,
  userId: { type: String, ref: "User" },
});

export const Room = mongoose.model("Room", roomSchema);
