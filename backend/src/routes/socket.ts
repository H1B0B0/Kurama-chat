import fs from "fs";
import https from "https";
import cors from "cors";
import { Server } from "socket.io";
import { log } from "../utils/log.js";
import mongoose from "mongoose";
import { Room } from "../models/room.js";
import { Message } from "../models/messages.js";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { User } from "../models/user.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const app = express();
app.use(cors());
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  key: fs.readFileSync(path.resolve(__dirname, "../cert/kurama.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "../cert/kurama.cert")),
};

export const server = https.createServer(options, app);

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

  socket.on("users", (roomId) => {
    if (roomUsers[roomId]) {
      const userIds = roomUsers[roomId];
      const userNamesList = userIds.map((userId) => userNames[userId] || 'Anonyme');
      socket.emit("usersList", userNamesList);
    } else {
      socket.emit("error", `Room with ID: ${roomId} does not exist.`);
    }
  });

  socket.on("delete_room", async (roomId) => {
    try {
      await Room.findByIdAndDelete(roomId);
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

  socket.on("join", async (roomId, username) => {
    // Vérifie si la salle existe
    let room = await Room.findById(roomId);
    if (!room) {
      // Si la salle n'existe pas, vous pouvez choisir de la créer ou d'envoyer une erreur
      socket.emit("join_error", `Room ${roomId} does not exist.`);
      return;
    }

    // Rejoint la salle
    socket.join(roomId);
    roomUsers[roomId] = [...(roomUsers[roomId] ?? []), socket.id];

    // Informe les autres utilisateurs de la salle
    socket.to(roomId).emit("receive_message", {
      text: `${username} has joined the room.`,
      systemMessage: true,
    });

    // Confirme la jonction à l'utilisateur
    socket.emit("room_joined", { roomName: room.name, roomId: roomId });
  });

  socket.on(
    "send_private_message",
    async (roomId, nickname, username, userid, messageData) => {
      // Récupérer l'ID du socket associé au surnom
      const userId = Object.keys(userNames).find(
        (key) => userNames[key] === nickname
      );

      let roomName = nickname + "," + username;

      if (userId) {
        socket?.emit("join_room", roomId, roomName);

        socket.emit("join", roomId);
        io.to(userId).emit("join", roomId);

        socket.emit("room_joined", { roomName: roomName, roomId: roomId });
        io.to(userId).emit("room_joined", {
          roomName: roomName,
          roomId: roomId,
        });

        // Envoyez le message à la salle
        socket.emit("private_message_sent", {
          text: messageData,
          name: username,
          userId: userid,
          date: new Date(),
          socketId: socket.id,
          roomId: roomId,
        });
      } else {
        socket.emit("error", "Nickname not found.");
      }
    }
  );

  socket.on("send_message", async (data) => {
    console.log("Message received: ", data);
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
