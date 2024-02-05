"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Message.js becomes Message.ts
const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);
exports.default = Message;
