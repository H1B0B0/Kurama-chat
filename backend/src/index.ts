import "dotenv/config";
import mongoose from "mongoose";
import { router as roomRoutes } from "./routes/roomRoutes.js";
import { router as messageRoutes } from "./routes/messageRoutes.js";
import { app, server } from "./routes/socket.js";
import { log } from "./utils/log.js";

mongoose
  .connect(
    `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}@mongodb:27017/${process.env.MONGO_INITDB_DATABASE}`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: any) => console.error("Could not connect to MongoDB", err));

app.use("/rooms", roomRoutes);
app.use("/messages", messageRoutes);

server.listen(process.env.PORT || 4000, () => {
  log("SERVER RUNNING");
});
