// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface Socket {
  on(event: string, callback: (data: any) => void): void;
  emit(event: string, data: any): void;
}

declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  export interface Request {
    user: {
      id: string;
    };
    connectedUsers: {
      [key: string]: string;
    };
    io: import('socket.io').Server;
  }
}
