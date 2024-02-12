import express, { Request, Response } from "express";
import { Room } from "../models/room.js"; // Import your Room model

export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  Room.find().then((rooms) => {
    res.json(rooms);
  });
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
