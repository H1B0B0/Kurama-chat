import fs from "fs";
import https from "https";
import cors from "cors";
import { Server } from "socket.io";
import { log } from "../utils/log.js";
import mongoose from "mongoose";
import { Room, Message } from "../models/models.js";
import express from "express";
import dotenv from "dotenv";

export const app = express();
app.use(cors());
dotenv.config();

// Load your SSL certificate and private key
const privateKey = fs.readFileSync("path/to/your/private/key", "utf8");
const certificate = fs.readFileSync("path/to/your/certificate", "utf8");

const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server instead of an HTTP server
export const server = https.createServer(credentials, app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  maxHttpBufferSize: 2e7,
});

mongoose
  .connect(
    `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}@mongodb:27017/${process.env.MONGO_INITDB_DATABASE}`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: any) => console.error("Could not connect to MongoDB", err));

let roomUsers: Record<string, string[]> = {};

io.on("connection", (socket) => {
  io.emit("users_response", roomUsers);
  log(`User Connected: ${socket.id}`);

  socket.on("join_room", async (roomId: string) => {
    socket.join(roomId);
    roomUsers = {
      ...roomUsers,
      [roomId]: [...(roomUsers[roomId] ?? []), socket.id],
    };

    // Save room to MongoDB
    let room = await Room.findById(roomId);
    if (!room) {
      room = new Room({ _id: roomId });
      await room.save();
    }

    io.emit("users_response", roomUsers);
    log(`User with ID: ${socket.id} joined room: ${roomId}`);
  });

  socket.on("send_message", async (data) => {
    io.emit("receive_message", data);

    // Save message to MongoDB
    const message = new Message({
      text: data.text,
      roomId: data.roomId,
      userId: socket.id,
    });
    await message.save();
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing_response", data);
  });

  socket.on("disconnect", () => {
    log("User Disconnected " + socket.id);
    for (const [roomId, users] of Object.entries(roomUsers)) {
      if (users.includes(socket.id)) {
        roomUsers[roomId] = [...users.filter((id) => id !== socket.id)];
        io.emit("receive_message", {
          text: "A user left the room.",
          socketId: "pedagochat",
          roomId: roomId,
        });
      }
    }
    io.emit("users_response", roomUsers);
  });
});
