import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Server } from 'http';
import socketio, { Socket } from 'socket.io';

import AppError from './errors/AppError';

import './config/mongo';

import routes from './routes';

const app = express();
const server = new Server(app);
const io = socketio(server);

const connectedUsers: any = {};

io.on('connection', (socket: Socket) => {
  const { user_id } = socket.handshake.query;
  connectedUsers[user_id] = socket.id;
});

app.use((request: Request, response: Response, next: NextFunction) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333, () => {
  console.log('Server started on port 3333');
});
