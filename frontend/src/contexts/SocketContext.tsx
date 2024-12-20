"use client";
import IMessage from "@/interfaces/IMessage";
import ISocketContext from "@/interfaces/ISocketContext";
import { createContext, useContext, useEffect, useState } from "react";
import * as socketIO from "socket.io-client";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";
import Toast from "../components/shared/Toast";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

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

function notify(message: IMessage, roomName: string) {
  toast.info(`${message.name} sent a message in ${roomName}`);
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
      router.push("/");
      return;
    }
    if (!socket) {
      let socket = socketIO.connect(process.env.NEXT_PUBLIC_BASE_URL!);
      socket.on("connect_error", (error) => {
        console.error("Erreur de connexion :", error);
      });
      socket.on("receive_message", async (data: IMessage) => {
        setMessages((prev) => {
          const newMessages = { ...prev };
          newMessages[data.roomId] = [
            ...(newMessages[data.roomId] ?? []),
            data,
          ];
          return newMessages;
        });
        console.log(data);
        if (
          data.name !== username &&
          data.roomId !== localStorage.getItem("currentRoomId") &&
          data.roomId !== "1" &&
          data.systemMessage !== true
        ) {
          const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + `rooms/${data.roomId}`
          );
          const room = await response.json();
          notify(data, room.name);
        }
      });
      socket.on("users_response", (data) => setRoomUsers(data));
      socket.on("private_message_sent", (data) => {
        socket.emit("send_message", data);
      });
      setSocket(socket);
    }
  });

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
