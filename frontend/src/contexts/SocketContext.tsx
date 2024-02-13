"use client";
import IMessage from "@/interfaces/IMessage";
import ISocketContext from "@/interfaces/ISocketContext";
import { createContext, useContext, useEffect, useState } from "react";
import * as socketIO from "socket.io-client";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";

const intialData: ISocketContext = {
  socket: undefined,
  roomUsers: {},
  messages: {},
  setMessages: function (
    value: (prevMessages: { [key: string]: IMessage[] }) => {
      [key: string]: IMessage[];
    }
  ): void {
    throw new Error("Function not implemented.");
  },
};

const SocketContext = createContext<ISocketContext>(intialData);

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [roomUsers, setRoomUsers] = useState({});
  const [socket, setSocket] = useState<socketIO.Socket>();
  const [messages, setMessages] = useState<{ [key: string]: IMessage[] }>({});

  const { username } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      router.replace("/");
      return;
    }
    let socket = socketIO.connect(process.env.NEXT_PUBLIC_BASE_URL!);
    socket.on("receive_message", (data: IMessage) => {
      setMessages((prev) => {
        const newMessages = { ...prev };
        newMessages[data.roomId] = [...(newMessages[data.roomId] ?? []), data];
        return newMessages;
      });
    });
    socket.on("users_response", (data) => setRoomUsers(data));
    socket?.emit("change_name", username);
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
      fetchMessagesFromServer(socket.id ?? "");
    }
  }, [socket]);

  async function fetchMessagesFromServer(roomId: string) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + `messages/${roomId}`
    );
    const data = await response.json();
    setMessages((prev) => ({ ...prev, [roomId]: data }));
  }

  return (
    <SocketContext.Provider
      value={{ socket, roomUsers, messages, setMessages }}
    >
      {children}
    </SocketContext.Provider>
  );
}
