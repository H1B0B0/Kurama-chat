"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const mongoose = require('mongoose');
const Message_1 = __importDefault(require("./models/Message"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Connect to MongoDB
mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${process.env.MONGO_INITDB_DATABASE}`)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const PORT = 3000;
// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // Listen for incoming chat messages
    socket.on('chat message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Received message:', data);
        // Save the message to MongoDB
        const message = new Message_1.default({ user: data.user, text: data.message });
        try {
            yield message.save();
            console.log('Message saved to the database');
            // Broadcast the message to all connected clients
            io.emit('chat message', data);
        }
        catch (err) {
            console.error('Error saving message to database:', err);
        }
    }));
    // Listen for user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.use(express_1.default.static('../front/public/'));
