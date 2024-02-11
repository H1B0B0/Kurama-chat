import express, { Request, Response } from "express";
import { Message } from "../models/messages.js";

export const router = express.Router();

router.get("/", (req, res) => {
  Message.find().then((messages) => {
    res.json(messages);
  });
});

router.get("/:roomId", (req, res) => {
  Message.find({ roomId: req.params.roomId }).then((messages) => {
    res.json(messages);
  });
});

export { router as messageRoutes };
