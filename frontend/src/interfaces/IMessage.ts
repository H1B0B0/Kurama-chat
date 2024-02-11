export default interface IMessage {
  text: string;
  name: string;
  id: string;
  socketId: string;
  roomId: string;
  userId: string; // Add this line
  image?: string;
  systemMessage?: boolean; // Add this line
}
