import { Socket } from "socket.io-client";
import IMessage from "./IMessage";

export default interface ISocketContext {
  socket: Socket | undefined;
  roomUsers: any;
  messages: { [key: string]: IMessage[] };
  setMessages: (
    value: (prevMessages: { [key: string]: IMessage[] }) => {
      [key: string]: IMessage[];
    }
  ) => void;
}
