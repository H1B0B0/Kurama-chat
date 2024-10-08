"use client";
import ChatBody from "@/components/Chat/ChatBody";
import ChatFooter from "@/components/Chat/ChatFooter";
import ChatHeader from "@/components/Chat/ChatHeader";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useUser } from "@/contexts/UserContext";

function Page() {
  const { roomId } = useParams();
  const { socket, roomUsers } = useSocket();
  const { username } = useUser();

  useEffect(() => {
    if (roomUsers[roomId]?.includes(socket?.id)) return;
    socket?.emit("user_joined", {
      username: username,
      roomId: roomId,
    });
    socket?.emit("join_room", roomId);
  }, []);

  return (
    <div className="flex relative flex-col w-full h-screen">
      <ChatHeader roomId={roomId} />
      <ChatBody roomId={roomId} />
      <ChatFooter roomId={roomId} />
    </div>
  );
}

export default Page;
