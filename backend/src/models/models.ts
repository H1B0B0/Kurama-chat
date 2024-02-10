import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: String,
});

const roomSchema = new mongoose.Schema({
  _id: String,
  userId: { type: String, ref: "User" }, // Reference to User
});


export const User = mongoose.model("User", userSchema);
export const Room = mongoose.model("Room", roomSchema);
