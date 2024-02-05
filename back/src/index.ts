import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import Message from './models/Message';
import dotenv from 'dotenv';
import messageRouters from '../dist/routes/messageRoutes';

// Load environment variables from .env file
dotenv.config();


// Connect to MongoDB
mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}@localhost:27017/${process.env.MONGO_INITDB_DATABASE}`)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: any) => console.error('Could not connect to MongoDB', err));

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Configure Express to serve static files from the public folder
app.use(express.static('../front/public/'));
app.use(express.json());
app.use(messageRouters);

const PORT = 3001;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for incoming chat messages
  socket.on('chat message', async (data) => {
    console.log('Received message:', data);

    // Prepare the message document according to the updated schema
    const messageDocument = {
      messages: [{
        timestamp: new Date(),
        content: data.message,
      }]
    };

    // Instantiate the Message model with the document
    const messageModel = new Message(messageDocument);

    try {
      // Save the message document to MongoDB
      await messageModel.save();
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

