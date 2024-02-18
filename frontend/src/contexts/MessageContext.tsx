"use client";
import IRoom from "@/interfaces/IRoom";
import IRoomContext from "@/interfaces/IRoomContext";
import { createContext, useContext, useEffect, useState } from "react";

const intialData: IRoomContext = {
  rooms: [],
  myRooms: [],
  setMyRooms: () => {},
  currentRoomId: "1", // Add this line
  setCurrentRoomId: () => {}, // Add this line
};

const RoomContext = createContext<IRoomContext>(intialData);

export function useRoom() {
  return useContext(RoomContext);
}

export default function RoomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [myRooms, setMyRooms] = useState<IRoom[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null); // Add this line

  useEffect(() => {
    fetchRoomsfromServer();
    fetchMyRooms();
  }, []);

  useEffect(() => {
    updateMyRooms();
  }, [myRooms]);

  async function fetchRoomsfromServer(): Promise<void> {
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "rooms");
    const rooms = await response.json();
    setRooms(rooms);
  }

  function fetchMyRooms() {
    const myRooms = localStorage.getItem("myRooms");
    if (myRooms) setMyRooms(JSON.parse(myRooms));
    else setMyRooms([]);
  }

  function updateMyRooms() {
    localStorage.setItem("myRooms", JSON.stringify(myRooms));
  }

  return (
    <RoomContext.Provider
      value={{ rooms, myRooms, setMyRooms, currentRoomId, setCurrentRoomId }}
    >
      {" "}
      // Add currentRoomId and setCurrentRoomId here
      {children}
    </RoomContext.Provider>
  );
}
