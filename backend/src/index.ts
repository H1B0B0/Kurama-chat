import "dotenv/config";
import { router as roomRoutes } from "./routes/roomRoutes.js";
import { router as messagesRoutes } from "./routes/messagesRoutes.js";
import { app, server } from "./routes/socket.js";
import { log } from "./utils/log.js";

app.use("/rooms", roomRoutes);
app.use("/messages", messagesRoutes);

server.listen(process.env.PORT || 4000, () => {
  log("SERVER RUNNING");
});
