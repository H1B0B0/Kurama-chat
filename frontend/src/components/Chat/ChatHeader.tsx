"use client";
import { useRoom } from "@/contexts/RoomContext";
import React, { useEffect, useState } from "react";
import Popup from "../shared/Popup";
import ClipboardJS from "clipboard";

function ChatHeader({ roomId }: { roomId: string }) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { rooms, myRooms } = useRoom();
  const room = rooms.concat(myRooms).find((room) => room.id === roomId);

  useEffect(() => {
    const clipboard = new ClipboardJS(".btn", {
      text: function () {
        return roomId;
      },
    });

    clipboard.on("success", function () {
      setIsCopied(true);
    });

    return () => {
      clipboard.destroy();
    };
  }, [roomId]);

  return (
    <div className="basis-[7%]  flex justify-between items-center p-3 font-medium dark:bg-neutral-800 bg-slate-200 rounded-lg">
      <p className="text-xl dark:text-white">{room?.title}</p>
      <button
        type="submit"
        className="btn bg-red-600 hover:bg-red-800 text-sm sm:text-base"
      >
        Copy Room ID
      </button>
      <Popup
        text="Room ID copied!"
        showPopup={isCopied}
        setShowPopup={setIsCopied}
      />
    </div>
  );
}

export default ChatHeader;
