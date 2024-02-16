import { useSocket } from "@/contexts/SocketContext";
import { useUser } from "@/contexts/UserContext";
import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import ChatImage from "./ChatImage";
import anime from "animejs";
import { convertToObject } from "typescript";

function Message({
  messages,
  message,
  currentUserId,
  index,
}: {
  messages: any;
  message: any;
  currentUserId: string;
  index: number;
}) {
  const messageRef = useRef<HTMLDivElement>(null);
  const previousMessage = messages && index > 0 ? messages[index - 1] : null;
  const nextMessage =
    messages && index < messages.length - 1 ? messages[index + 1] : null;

  useEffect(() => {
    if (index > messages.length - 20) {
      const newIndex = 20 - (messages.length - index);
      anime({
        targets: messageRef.current,
        translateY: [-60, 0],
        opacity: [0, 1],
        duration: 500,
        delay: newIndex * 10,
      });
    }
  }, [message]);

  const showUsername =
    !previousMessage ||
    previousMessage.userId !== message.userId ||
    (previousMessage &&
      previousMessage.userId === message.userId &&
      Math.abs(
        new Date(message.date).getTime() -
          new Date(previousMessage.date).getTime()
      ) >
        5 * 60 * 1000);
  const showDate = !nextMessage || nextMessage.userId !== message.userId;

  return message.systemMessage ? (
    <div className="flex self-center" key={index} ref={messageRef}>
      <div className="flex justify-center items-center dark:text-gray-300">
        <p>{message.text}</p>
      </div>
    </div>
  ) : message.userId === currentUserId ? (
    <div
      className="flex self-end flex-col items-end"
      key={index}
      ref={messageRef}
    >
      {message.text && (
        <div className="flex justify-center items-center px-3 py-1 text-white rounded-full rounded-br-none bg-primary dark:bg-purple-900">
          <p className="font-sans">{message.text}</p>
        </div>
      )}
      {message.image && <ChatImage imgURL={message.image} />}
    </div>
  ) : (
    <div
      className="flex gap-2 self-start dark:text-gray-200"
      key={index}
      ref={messageRef}
    >
      <div className="self-center">
        <Avatar
          name={message.name}
          round={true}
          size="30"
          className="text-sm"
        />
      </div>
      <div>
        {showUsername && (
          <p className="pl-2 text-sm align-bottom">{message.name}</p>
        )}
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
        {showDate && (
          <p className="py-2 pl-2 text-xs font-light dark:text-white">
            {message.date
              ? new Date(message.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "En direct"}
          </p>
        )}
      </div>
    </div>
  );
}

export default Message;
