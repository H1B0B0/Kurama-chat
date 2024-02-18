import "dotenv/config";
import mongoose from "mongoose";
import { router as roomRoutes } from "./routes/roomRoutes.js";
import { router as messageRoutes } from "./routes/messageRoutes.js";
import { router as userRoutes } from "./routes/userRoutes.js";
import { router as SingleUser } from "./routes/single_user.js";
import { app, server } from "./routes/socket.js";
import { log } from "./utils/log.js";
import cors from "cors";
import bodyParser from "body-parser";

mongoose
  .connect(
    `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}@mongodb:27017/${process.env.MONGO_INITDB_DATABASE}`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: any) => console.error("Could not connect to MongoDB", err));

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/rooms", roomRoutes);
app.use("/messages", messageRoutes);
app.use("/user", userRoutes);
app.use("/single_user", SingleUser);

server.listen(process.env.PORT || 4000, () => {
  log("SERVER RUNNING");
});
