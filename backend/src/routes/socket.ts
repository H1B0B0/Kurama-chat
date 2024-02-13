import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { log } from "../utils/log.js";
import mongoose from "mongoose";
import { Room } from "../models/room.js";
import { Message } from "../models/messages.js";
import express from "express";
import dotenv from "dotenv";
import { User } from "../models/user.js";

export const app = express();
app.use(cors());
dotenv.config();

export const server = http.createServer(app);

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
let userNames: { [key: string]: string } = {};

io.on("connection", (socket) => {
  // changer de nom
  socket.on("change_name", ({ newName, OldName, roomId }) => {
    userNames[socket.id] = newName;
    socket.emit("name_changed", newName);

    if (roomId) {
      io.emit("receive_message", {
        text: OldName + " change is name for " + newName,
        socketId: "Kurama-chat",
        roomId: roomId,
        systemMessage: true,
      });
    }
  });

  // Clear les messages du chat
  socket.on("clear", async (roomId) => {
    try {
      await Message.deleteMany({ roomId: roomId });
      io.to(roomId).emit("chat_cleared", {
        roomId: roomId,
      });
      console.log("Chat cleared for room: ", roomId);
    } catch (error) {
      console.log("Failed to clear chat: ", error);
      socket.emit("error", "Failed to clear chat.");
    }
  });

  socket.on("list", async () => {
    try {
      const rooms = await Room.find({}, "name");
      const roomNames = rooms.map((room) => room.name);
      socket.emit("roomsList", roomNames);
      console.log("Rooms listed: ", roomNames);
    } catch (error) {
      console.log("Failed to list rooms: ", error);
      socket.emit("error", "Failed to list rooms.");
    }
  });

  socket.on("delete_room", async (roomId) => {
    try {
      // Delete the room from the database
      await Room.findByIdAndDelete(roomId);
  
      // Notify all clients that the room has been deleted
      io.emit("room_deleted", roomId);
  
      console.log(`Room ${roomId} deleted.`);
    } catch (error) {
      console.error(`Error deleting room ${roomId}: `, error);
      socket.emit("error", "Failed to delete room.");
    }
  });

  io.emit("users_response", roomUsers);
  log(`User Connected: ${socket.id}`);

  socket.on("join_room", async (roomId, roomName) => {
    socket.join(roomId);
    roomUsers = {
      ...roomUsers,
      [roomId]: [...(roomUsers[roomId] ?? []), socket.id],
    };

    // Save room to MongoDB
    let room = await Room.findById(roomId);
    if (!room) {
      room = new Room({ _id: roomId, userId: socket.id, name: roomName });
      await room.save();
      console.log("Room created: ", room);
    }

    io.emit("users_response", roomUsers);
    log(`User with ID: ${socket.id} joined room: ${roomId}`);
  });

  socket.on("send_message", async (data) => {
    io.emit("receive_message", data);

    // Save message to MongoDB
    const message = new Message({
      text: data.text,
      name: data.name,
      id: data.id,
      socketId: socket.id,
      roomId: data.roomId,
      image: data.image,
      userId: data.userId,
      date: data.date,
      systemMessage: data.systemMessage,
    });
    await message.save();
    console.log("Message saved: ", message);
  });

  socket.on("typing", ({ data, roomId }) => {
    socket.to(roomId).emit("typing_response", {
      data: data,
      roomId: roomId,
    });
  });

  socket.on("user_joined", ({ username, roomId }) => {
    io.emit("receive_message", {
      text: username + " joined the room. 🗿",
      socketId: "Kurama-chat",
      roomId: roomId,
      systemMessage: true,
    });
  });

  socket.on("leave_room", async ({ username, roomId }) => {
    socket.leave(roomId);
    if (roomUsers[roomId]) {
      roomUsers[roomId] = roomUsers[roomId].filter((id) => id !== socket.id);
    }

    io.emit("receive_message", {
      text: username + " left the room. ➡️🚪",
      socketId: "Kurama-chat",
      roomId: roomId,
      systemMessage: true,
    });

    socket.to(roomId).emit("users_response", roomUsers);
    console.log(`User with ID: ${socket.id} left room: ${roomId}`);
  });

  socket.on("quit_room", async ({ username, roomId }) => {
    socket.leave(roomId);
    if (roomUsers[roomId]) {
      roomUsers[roomId] = roomUsers[roomId].filter((id) => id !== socket.id);
    }

    io.emit("receive_message", {
      text: username + " quit the room. ➡️🚪",
      socketId: "Kurama-chat",
      roomId: roomId,
      systemMessage: true,
    });

    socket.to(roomId).emit("users_response", roomUsers);

    if (roomUsers[roomId] && roomUsers[roomId].length === 0) {
      try {
        await Room.findByIdAndDelete(roomId);
        console.log(`Room with ID: ${roomId} was deleted`);
      } catch (error) {
        console.log(
          `Failed to delete room with ID: ${roomId}. Error: ${error}`
        );
      }
    }
  });

  socket.on("logout", async ({ username, roomId }) => {
    if (roomUsers[roomId]) {
      roomUsers[roomId] = roomUsers[roomId].filter((id) => id !== socket.id);
    }

    io.emit("receive_message", {
      text: username + " disconnect. ❌",
      socketId: "Kurama-chat",
      roomId: roomId,
      systemMessage: true,
    });

    socket.to(roomId).emit("users_response", roomUsers);
    log(`User with ID: ${socket.id} left room: ${roomId}`);
    socket.leave(roomId);
    delete userNames[socket.id];
  });

  socket.on("disconnect", () => {
    for (const [roomId, users] of Object.entries(roomUsers)) {
      if (users.includes(socket.id)) {
        let userName = userNames[socket.id];
        roomUsers[roomId] = [...users.filter((id) => id !== socket.id)];
        io.emit("receive_message", {
          text: userName + " disconnect. ❌",
          socketId: "Kurama-chat",
          roomId: roomId,
          systemMessage: true,
        });
        socket.to(roomId).emit("users_response", roomUsers);
      }
    }
  });
});
