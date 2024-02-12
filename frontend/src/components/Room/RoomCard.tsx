import { useRoom } from "@/contexts/RoomContext";
import IRoom from "@/interfaces/IRoom";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import Avatar from "react-avatar";
import { ImExit } from "react-icons/im";

function RoomCard({ room, users }: { room: IRoom; users: string[] }) {
  const { roomId } = useParams();
  const { myRooms, setMyRooms } = useRoom();
  return (
    <Link
      href={`chat/${room.id}`}
      className={`flex group relative gap-3 items-center p-2 flex-col sm:flex-row ${
        room.id === roomId ? "bg-gray- dark:bg-gray-700" : ""
      }`}
    >
      <div>
        {room.id === "1" ? (
          <Image
            src="/images/globe.png"
            height={50}
            width={50}
            className="rounded-full bg-gray-800 dark:bg-gray-200"
            alt="profile"
          />
        ) : (
          <Avatar
            name={room.title}
            round="10px"
            size="50"
            className="text-sm"
          />
        )}
      </div>
      <div className="hidden sm:block">
        <p className="font-medium line-clamp-1  text-gray-900 dark:text-gray-100">
          {room.title}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <span className="text-xs">🌐</span> {users.length} online
        </p>
      </div>
      {room.id !== "1" && (
        <span
          className="hidden absolute right-3 justify-center items-center p-2 bg-red-500 rounded-full group-hover:flex hover:bg-red-700"
          onClick={() => {
            setMyRooms(myRooms.filter((r) => r.id != room.id));
          }}
        >
          <ImExit className="text-white" />
        </span>
      )}
    </Link>
  );
}

export default RoomCard;
