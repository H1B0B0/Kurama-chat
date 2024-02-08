import express, { Request, Response } from "express";
import mongoose from "mongoose";

export const router = express.Router();

export type Message = {
  text: string;
  roomId: string;
  userId: string;
};

const MessageSchema = new mongoose.Schema<Message>({
  text: String,
  roomId: String,
  userId: String,
});

const MessageModel = mongoose.model<Message>("Message", MessageSchema);

router.get("/:roomId/:userId", async (req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find({
      roomId: req.params.roomId,
      userId: req.params.userId,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
