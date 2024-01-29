import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
const mongoose = require('mongoose');
import Message from './models/Message';
import dotenv from 'dotenv';
dotenv.config();


// Connect to MongoDB
mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${process.env.MONGO_INITDB_DATABASE}`)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err:any) => console.error('Could not connect to MongoDB', err));

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for incoming chat messages
  socket.on('chat message', async (data) => {
    console.log('Received message:', data);

    // Save the message to MongoDB
    const message = new Message({ user: data.user, text: data.message });
    try {
      await message.save();
      console.log('Message saved to the database');
      // Broadcast the message to all connected clients
      io.emit('chat message', data);
    } catch (err) {
      console.error('Error saving message to database:', err);
    }
  });

  // Listen for user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.static('../front/public/'));
