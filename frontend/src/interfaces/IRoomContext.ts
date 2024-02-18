import IRoom from "./IRoom";

export default interface IRoomContext {
  rooms: IRoom[];
  myRooms: IRoom[];
  currentRoomId: string | null;
  setMyRooms: React.Dispatch<React.SetStateAction<IRoom[]>>;
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string | null>>;
}
