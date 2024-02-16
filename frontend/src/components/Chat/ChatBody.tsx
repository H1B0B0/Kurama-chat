"use client";
import { useSocket } from "@/contexts/SocketContext";
import { useUser } from "@/contexts/UserContext";
import React, { useEffect, useRef, useState } from "react";
import Message from "./messages";

function ChatBody({ roomId }: { roomId: string }) {
  const [typing, setTyping] = useState<string>("");
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { messages, socket, setMessages } = useSocket();
  const { username } = useUser();

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      fetchMessagesFromServer(roomId);
    }
  }, [socket, roomId]);

  const currentUserId = localStorage.getItem("userId");

  async function fetchMessagesFromServer(roomId: string) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + `messages/${roomId}`
    );
    const data = await response.json();
    setMessages((prev: any) => ({ ...prev, [roomId]: data }));
  }

  interface ChatClearedEvent {
    roomId: string;
  }

  interface TypingResponseEvent {
    data: any;
    roomId: string;
  }

  useEffect(() => {
    const nameChangedHandler = (newName: string) => {
      localStorage.setItem("name", newName);
    };

    socket?.on("name_changed", nameChangedHandler);

    // Cleanup function
    return () => {
      socket?.off("name_changed", nameChangedHandler);
    };
  }, [socket]);

  useEffect(() => {
    const chatClearedHandler = ({
      roomId: responseRoomId,
    }: ChatClearedEvent) => {
      if (responseRoomId === roomId) {
        setMessages((prev: any) => ({ ...prev, [roomId]: [] }));
      }
    };

    const typingResponseHandler = ({
      data,
      roomId: responseRoomId,
    }: TypingResponseEvent) => {
      if (responseRoomId === roomId) {
        setTyping(data);
      }
    };

    socket?.on("chat_cleared", chatClearedHandler);
    socket?.on("typing_response", typingResponseHandler);

    // Cleanup function
    return () => {
      socket?.off("chat_cleared", chatClearedHandler);
      socket?.off("typing_response", typingResponseHandler);
    };
  }, [socket, roomId]);

  return (
    <div style={{ flexGrow: 1, overflowY: "auto" }}>
      <div className="basis_[85%] overflow-y-scroll p-5 w-full flex flex-col gap-2 custom-scrollbar rounded-lg">
        {messages[roomId]?.map((message: any, index: number) => (
          <Message
            message={message}
            currentUserId={currentUserId ?? ""}
            index={index}
            messages={messages[roomId]}
          />
        ))}
        <div ref={lastMessageRef} className="mt-auto text-slate-500">
          {typing}
        </div>
      </div>
    </div>
  );
}
export default ChatBody;
