import IRoom from "./IRoom";

export default interface IRoomContext {
  rooms: IRoom[];
  myRooms: IRoom[];
  currentRoomId: string;
  setMyRooms: React.Dispatch<React.SetStateAction<IRoom[]>>;
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string>>;
}
