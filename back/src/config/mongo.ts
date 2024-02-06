import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(
  `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}@mongodb:27017/${process.env.MONGO_INITDB_DATABASE}`,
  {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);
