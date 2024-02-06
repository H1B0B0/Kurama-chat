import { useMemo } from "react";
import socketio from "socket.io-client";

interface IRequest {
  user_id: string;
}

const Socket = ({ user_id }: IRequest) => {
  const socket = useMemo(
    () =>
      socketio("http://backend:3333", {
        query: { user_id },
      }),
    [user_id]
  );

  return socket;
};
export default Socket;
