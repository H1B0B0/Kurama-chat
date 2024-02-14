import express, { Request, Response } from "express";
export const router = express.Router();
import { SingleUser } from "../models/single_user.js";

router.post("/newuser", async (req: Request, res: Response) => {
  const { username, socketId } = req.body;

  console.log(req.body); // Log the request body

  try {
    const existingUser = await SingleUser.findOne({
      $or: [{ username }, { socketId }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or SocketId already exists" });
    }

    const newUser = await SingleUser.create({
      username,
      socketId,
    });

    res.status(201).json(newUser);
  } catch (error: any) {
    console.error(error); // Log the entire error
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await SingleUser.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:socketId", async (req: Request, res: Response) => {
  const { socketId } = req.params;

  try {
    const user = await SingleUser.findOne({ socketId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/updateusername", async (req: Request, res: Response) => {
  const { socketId, newUsername } = req.body;

  try {
    const user = await SingleUser.findOne({ socketId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = newUsername;
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
