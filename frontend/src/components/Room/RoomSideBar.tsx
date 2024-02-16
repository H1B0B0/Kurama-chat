"use client";
import React, { useState } from "react";
import RoomCard from "./RoomCard";
import IRoom from "@/interfaces/IRoom";
import { useRoom } from "@/contexts/RoomContext";
import { useSocket } from "@/contexts/SocketContext";
import { BiMessageAdd } from "react-icons/bi";
import AddRoomPanel from "./AddRoomPanel";
import ThemeSwitcher from "../shared/themeswitcher";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

function RoomSideBar() {
  const [showAddRoomPanel, setShowAddRoomPanel] = useState(false);
  const { rooms, myRooms, currentRoomId, setCurrentRoomId } = useRoom();
  const { socket, roomUsers } = useSocket();
  const router = useRouter();
  const { username } = useUser();

  const hideAddRoomPanel = () => setShowAddRoomPanel(false);

  const handleRoomClick = (newRoomId: string) => {
    if (currentRoomId !== newRoomId) {
      socket?.emit("leave_room", { username: username, roomId: currentRoomId });
    } else {
      console.log("No current room to leave");
    }
    setCurrentRoomId(newRoomId);
  };

  const logout = () => {
    socket?.emit("logout", { username: username, roomId: currentRoomId });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    router.push("/");
  };

  return (
    <div className="overflow-y-scroll custom-scrollbar w-20 h-screen dark:bg-neutral-800 bg-slate-200  sm:w-1/4 rounded-lg">
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-4 pt-1 h-10 text-lg font-semibold text-white rounded-full mt-5 bg-red-600 hover:bg-red-500 transition duration-300  "
          onClick={logout}
        >
          Leave
        </button>
      </div>
      <ThemeSwitcher />
      <p className="flex flex-col px-2 py-5 sm:px-5 h-[56px] text-xl sm:text-2xl font-semibold dark:text-white">
        Rooms 🌐
      </p>
      {rooms.map((room: IRoom, index) => {
        return (
          <div onClick={() => handleRoomClick(room.id)} key={index}>
            <RoomCard room={room} users={roomUsers[room.id] ?? []} />
          </div>
        );
      })}
      <p className="flex flex-col px-2 pt-3 text-lg font-semibold sm:text-xl sm:px-5 dark:text-white">
        Rooms 🔒
      </p>
      <div className="py-1">
        {myRooms.map((room: IRoom, index) => {
          if (room.id != "1") {
            return (
              <div onClick={() => handleRoomClick(room.id)} key={index}>
                <RoomCard room={room} users={roomUsers[room.id] ?? []} />
              </div>
            );
          }
        })}
      </div>
      <div
        className="flex justify-center items-center p-1 m-2 rounded-lg border-2 cursor-pointer text-primary border-primary hover:bg-primary hover:text-white"
        onClick={() => setShowAddRoomPanel(true)}
      >
        <BiMessageAdd size={30} />
      </div>
      {showAddRoomPanel && (
        <div>
          <AddRoomPanel hideAddRoomPanel={hideAddRoomPanel} />
        </div>
      )}
    </div>
  );
}

export default RoomSideBar;
