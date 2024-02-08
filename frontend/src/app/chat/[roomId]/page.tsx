"use client";
import ChatBody from "@/components/Chat/ChatBody";
import ChatFooter from "@/components/Chat/ChatFooter";
import ChatHeader from "@/components/Chat/ChatHeader";
import { useSocket } from "@/contexts/SocketContext";
import { useUser } from "@/contexts/UserContext";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

function Page() {
  const { roomId } = useParams();
  const { socket, roomUsers } = useSocket();
  const { username } = useUser();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (roomUsers[roomId]?.includes(socket?.id)) return;
    socket?.emit("send_message", {
      text: username + " joined the room.",
      socketId: "pedagochat",
      roomId: roomId,
    });
    socket?.emit("join_room", roomId);
  }, []);

  useEffect(() => {
    fetch(`/api/messages/${roomId}`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error(error));
  }, [roomId]);

  return (
    <div className="flex relative flex-col w-full h-screen">
      <ChatHeader roomId={roomId} />
      <ChatBody roomId={roomId} messages={messages} />
      <ChatFooter roomId={roomId} />
    </div>
  );
}

export default Page;
