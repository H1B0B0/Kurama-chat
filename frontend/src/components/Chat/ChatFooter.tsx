import { useSocket } from "@/contexts/SocketContext";
import { useUser } from "@/contexts/UserContext";
import React, { useRef, useState, useEffect } from "react";
import { AiFillPlusCircle, AiFillLike } from "react-icons/ai";
import { BsImage, BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend, IoMdCloseCircle } from "react-icons/io";
import Picker from "emoji-picker-react";
import Toast from "../shared/Toast";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useRoom } from "@/contexts/RoomContext";
import { useRouter } from "next/navigation";

function ChatFooter({ roomId }: { roomId: string }) {
  const [showListPopup, setShowListPopup] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const [message, setMessage] = useState<string>("");
  const { socket } = useSocket();
  const { username } = useUser();
  const { myRooms, setMyRooms } = useRoom();
  const [id, setId] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const inputRef = useRef<any | null>(null);
  const fileRef = useRef<any | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const router = useRouter();
  const onEmojiPick = (emojiObj: any) => {
    setMessage((prevInput) => prevInput + emojiObj.emoji);
    inputRef.current.focus();
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("roomsList", (roomNames) => {
        const message = roomNames.join(", ");
        toast.info(`Rooms: ${message}`);
      });

      socket.on("room_created", (room) => {
        toast.success(`Room created: ${room.name}`);
      });

      return () => {
        socket.off("roomsList");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("room_deleted", (deletedRoomId) => {
        if (deletedRoomId === roomId) {
          toast.success("Room deleted successfully.");
          setMyRooms(myRooms.filter((room) => room.id !== roomId));
        }
      });
      return () => {
        socket.off("room_deleted");
      };
    }
  }, [socket, roomId]);

  useEffect(() => {
    if (socket) {
      socket.on("room_joined", (id, username) => {
        toast.success(`Joined room: ${id.roomName}`);
        setMyRooms((prevRooms) => [
          ...prevRooms,
          { id: id.roomId, title: id.roomName },
        ]);
      });

      socket.on("join_error", (errorMessage) => {
        toast.error(errorMessage);
      });

      return () => {
        socket.off("room_joined");
        socket.off("join_error");
      };
    }
  }, [socket]);

  function handleCommand(commandString: string, socket: any) {
    const parts = commandString.substr(1).split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "nick":
        const newName = args.join(" ");
        socket?.emit("change_name", {
          OldName: localStorage.getItem("name"),
          newName,
          roomId,
        });
        break;
      case "list":
        socket.emit("list", args.join(" "));
        break;
      case "create":
        if (args.length === 0) {
          console.error("No room name specified.");
          toast.error("Please specify a room name.");
        } else {
          const roomName = args.join(" ");
          const newRoomId = uuidv4();

          let newRoom = {
            title: roomName,
            id: newRoomId,
          };
          console.log("New room: ", newRoomId);
          setMyRooms([...myRooms, newRoom]);
          toast.info(`Creating room: ${roomName}`);
          socket?.emit("join_room", newRoomId, roomName);
        }
        break;
      case "delete":
        socket?.emit("delete_room", roomId);
        toast.info("Deleting room...");
        break;
      case "join":
        if (args.length === 0) {
          toast.error("Please specify a room ID to join.");
        } else {
          const roomIdToJoin = args[0];
          const username = localStorage.getItem("name");
          socket.emit("join", roomIdToJoin, username);
        }
        break;
      case "quit":
        const username = localStorage.getItem("name");
        socket?.emit("leave_room", username, roomId);
        setMyRooms(myRooms.filter((room) => room.id !== roomId));
        router.push("/chat/1");
        break;
      case "users":
        socket?.emit("users");
        break;
      case "msg":
        const msgParam = args.join(" ");
        socket?.emit("msg", msgParam);
        break;
      case "clear":
        socket.emit("clear", roomId);
        break;
      default:
        console.error("Unknown command.");
        break;
    }
  }

  const handleSendMessage = (e: React.FormEvent, message: string) => {
    e.preventDefault();
    if (message.trim() || image) {
      if (message.startsWith("/")) {
        // This is a command, handle it
        handleCommand(message, socket);
      } else {
        socket?.emit("send_message", {
          text: message,
          name: username,
          userId: localStorage.getItem("userId"),
          date: new Date(),
          socketId: socket?.id,
          roomId: roomId,
          image,
        });
      }
      setMessage("");
      setImage(null);
    }
  };

  const handleTyping = () => {
    socket?.emit("typing", {
      data: message ? username + " is typing ..." : "",
      roomId: roomId,
    });
  };

  const handleImageErrors = (e: any) => {
    const data = e.target.files[0];
    if (data.size > 1e7 || data.type.split("/")[0] !== "image") {
      data.size > 1e7
        ? setToastMessage("Image size should not exceed 10 MB")
        : setToastMessage("Please use a valid image format");
      e.target.value = "";
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1500);
      return true;
    }
    return false;
  };

  const handleImageUpload = (e: any) => {
    setImage(null);
    const data = e.target.files[0];
    if (handleImageErrors(e)) return;
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64 = reader.result as string;
      setImage(base64);
      e.target.value = "";
    };
    reader.readAsDataURL(data);
  };

  return (
    <>
      <ToastContainer position="bottom-left" />
      {showToast && <Toast message={toastMessage} />}
      {image && (
        <div className="relative border text-red-600 rounded-lg max-w-[6rem] h-24 ml-4 mb-1">
          <IoMdCloseCircle
            size={20}
            className="absolute -right-2 -top-2 text-xs cursor-pointer text-red-600"
            onClick={() => setImage(null)}
          />
          <img src={image} className="w-full h-full object-contain" />
        </div>
      )}
      <div className="basis-[8%] p-2 flex items-center dark:bg-neutral-800 bg-slate-200  gap-4 rounded-lg">
        {message.length === 0 && (
          <>
            <AiFillPlusCircle
              size={20}
              className="cursor-pointer text-red-600"
            />
            <BsImage
              size={20}
              className="cursor-pointer text-red-600"
              onClick={() => fileRef.current.click()}
            />
            <input
              type="file"
              name="image"
              ref={fileRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </>
        )}
        <div className="relative w-full">
          <div className="absolute -right-8 sm:right-0 bottom-12 ">
            {showEmojiPicker && (
              <Picker
                onEmojiClick={onEmojiPick}
                previewConfig={{ showPreview: false }}
              />
            )}
          </div>
          <BsEmojiSmileFill
            size={20}
            className="cursor-pointer absolute top-[6px] right-2 text-red-600"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />

          <form onSubmit={(e) => handleSendMessage(e, message)}>
            <input
              ref={inputRef}
              type="text"
              value={message}
              className="w-full h-8 p-2 transition-all bg-gray-100 dark:text-gray-600 rounded-full focus:outline-none"
              placeholder="Aa"
              onKeyUp={handleTyping}
              onChange={(e) => {
                setMessage(e.target.value), setShowEmojiPicker(false);
              }}
            />
          </form>
        </div>
        {message.length === 0 && !image ? (
          <AiFillLike
            size={28}
            className="cursor-pointer text-red-600"
            onClick={(e) => handleSendMessage(e, "👍 <Bon toutou>")}
          />
        ) : (
          <IoMdSend
            size={28}
            className="cursor-pointer text-red-600"
            onClick={(e) => handleSendMessage(e, message)}
          />
        )}
      </div>
    </>
  );
}

export default ChatFooter;
