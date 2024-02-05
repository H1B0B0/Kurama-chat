import mongoose, { Document, Schema } from "mongoose";

// Define an interface that represents a document in MongoDB
interface IUser extends Document {
  username: string;
  password: string;
}

// Define a schema that maps to a MongoDB collection and defines the shape of the documents within that collection
const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// Define a model for interacting with the database
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
