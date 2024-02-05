import express, { Request, Response } from "express";
import MessageModel from "../models/Message";

const router = express.Router();

// Route pour récupérer tous les messages
router.get("/messages", async (req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find({});
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Route pour ajouter un nouveau message
router.post("/messages", async (req: Request, res: Response) => {
  const newMessage = {
    timestamp: new Date(), // ou req.body.timestamp
    content: req.body.content,
  };

  try {
    const updatedDocument = await MessageModel.findOneAndUpdate(
      {},
      { $push: { messages: newMessage } },
      { new: true, upsert: true }
    );
    res.status(201).json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;
