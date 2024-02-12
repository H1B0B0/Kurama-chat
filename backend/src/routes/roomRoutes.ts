import express, { Request, Response } from "express";
import { Room } from "../models/room.js"; // Import your Room model

export const router = express.Router();

export type Room = {
  title: string;
  id: string;
};

const ROOMS: Room[] = [
  {
    title: "Global Chatroom",
    id: "1",
  },
];

router.get("/", (req: Request, res: Response) => {
  res.json(ROOMS);
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find(); // Use Mongoose to get all rooms from the database
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/:roomId", (req: Request, res: Response) => {
  Room.find({ _id: req.params.roomId }).then((rooms) => {
    if (rooms.length > 0) {
      res.json(rooms[0]);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  });
});

export { router as roomRoutes };
