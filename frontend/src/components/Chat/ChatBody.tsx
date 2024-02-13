"use client";
import { useSocket } from "@/contexts/SocketContext";
import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import ChatImage from "./ChatImage";

function ChatBody({ roomId }: { roomId: string }) {
  const [typing, setTyping] = useState<string>("");
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { messages, socket, setMessages } = useSocket();

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="basis-[85%] overflow-y-scroll p-5 w-full flex flex-col gap-2 custom-scrollbar">
      {messages[roomId]?.map((message: any, index: number) =>
        message.systemMessage ? (
          <div className="flex self-center" key={index}>
            <div className="flex justify-center items-center dark:text-gray-300">
              <p>{message.text}</p>
            </div>
          </div>
        ) : message.userId === currentUserId ? ( // Compare the message user ID with the current user ID
          <div className="flex self-end flex-col items-end" key={index}>
            {message.text && (
              <div className="flex justify-center items-center px-3 py-1 text-white rounded-full rounded-br-none bg-primary dark:bg-purple-900">
                <p className="font-sans">{message.text}</p>
              </div>
            )}
            {message.image && <ChatImage imgURL={message.image} />}
          </div>
        ) : (
          <div className="flex gap-2 self-start dark:text-gray-200" key={index}>
            <div className="self-center">
              <Avatar
                name={message.name}
                round={true}
                size="30"
                className="text-sm"
              />
            </div>
            <div>
              <p className="pl-2 text-sm align-bottom">{message.name}</p>
              {message.text && (
                <div
                  className={`px-3 py-1 bg-gray-200 rounded-full dark:bg-blue-950 ${
                    message.image ? "rounded-bl-none" : "rounded-tl-none"
                  } w-fit`}
                >
                  <p className="font-sans">{message.text}</p>
                </div>
              )}
              {message.image && <ChatImage imgURL={message.image} />}
              <p className="py-2 pl-2 text-xs font-light dark:text-white">
                {message.date
                  ? new Date(message.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "En direct"}
              </p>
            </div>
          </div>
        )
      )}
      <div ref={lastMessageRef} className="mt-auto text-slate-500">
        {typing}
      </div>
    </div>
  );
}

export default ChatBody;
