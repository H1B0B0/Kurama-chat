"use client";
import React, { useState, useRef, useEffect } from "react";
import RoomCard from "./RoomCard";
import IRoom from "@/interfaces/IRoom";
import { useRoom } from "@/contexts/RoomContext";
import { useSocket } from "@/contexts/SocketContext";
import { BiMessageAdd } from "react-icons/bi";
import AddRoomPanel from "./AddRoomPanel";
import ThemeSwitcher from "../shared/themeswitcher";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import anime from "animejs";

function RoomSideBar() {
  const [showAddRoomPanel, setShowAddRoomPanel] = useState(false);
  const { rooms, myRooms, currentRoomId, setCurrentRoomId } = useRoom();
  const { socket, roomUsers } = useSocket();
  const router = useRouter();
  const { username } = useUser();
  const addRoomPanelRef = useRef<HTMLDivElement>(null);

  const hideAddRoomPanel = () => setShowAddRoomPanel(false);

  const handleRoomClick = (newRoomId: string) => {
    if (currentRoomId !== newRoomId) {
      socket?.emit("leave_room", { username: username, roomId: currentRoomId });
    } else {
      console.log("No current room to leave");
    }
    setCurrentRoomId(newRoomId);
    localStorage.setItem("currentRoomId", newRoomId);
  };

  const logout = () => {
    socket?.emit("logout", { username: username, roomId: currentRoomId });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    router.push("/");
  };

  useEffect(() => {
    if (showAddRoomPanel) {
      anime({
        targets: addRoomPanelRef.current,
        opacity: [0, 1],
        translateY: [-100, 0],
        duration: 1000,
      });
    }
  }, [showAddRoomPanel]);

  return (
    <div
      className="overflow-y-scroll custom-scrollbar w-full sm:w-20 h-screen dark:bg-neutral-800 bg-slate-200 md:w-1/4 rounded-lg"
      style={{ maxWidth: "25vw", height: "calc(100vh - 1rem)" }}
    >
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-4 pt-1 h-10 text-sm sm:text-lg font-semibold text-white rounded-full mt-5 bg-red-600 hover:bg-red-500 transition duration-300"
          onClick={logout}
        >
          Leave
        </button>
      </div>
      <ThemeSwitcher />
      <p className="flex flex-row items-center px-2 py-5 sm:px-15 h-[56px] text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold dark:text-white">
        Rooms 🌐
      </p>
      {rooms.map((room: IRoom, index) => {
        return (
          <div onClick={() => handleRoomClick(room.id)} key={index}>
            <RoomCard room={room} users={roomUsers[room.id] ?? []} />
          </div>
        );
      })}
      <p className="flex flex-row items-center px-2 py-5 sm:px-15 h-[56px] text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold dark:text-white">
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
        <div className="fixed top-0 left-0 w-full h-full z-50">
          <div className="absolute inset-0 backdrop-blur-md"></div>
          <div ref={addRoomPanelRef}>
            <AddRoomPanel hideAddRoomPanel={hideAddRoomPanel} />
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomSideBar;
