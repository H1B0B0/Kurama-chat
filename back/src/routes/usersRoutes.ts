import express, { Request, Response } from "express";
import UserModel from "../models/Users";

const router = express.Router();

// Route pour créer un nouvel utilisateur
router.post("/users", async (req: Request, res: Response) => {
  const newUser = new UserModel({
    username: req.body.username,
    password: req.body.password, // Vous devriez hasher le mot de passe
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Route pour authentifier un utilisateur
// Ajoutez ici la logique d'authentification
router.post("/users/authenticate", async (req: Request, res: Response) => {
  // Implémentation de l'authentification
});

export default router;
