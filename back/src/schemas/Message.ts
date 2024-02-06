import mongoose, { Document, Schema } from 'mongoose';

export interface Message extends Document {
  user: {
    user_id: string;
    name: string;
    username: string;
  };
  content: string;
}

const MessageSchema = new Schema(
  {
    user: {
      type: {
        user_id: String,
        name: String,
        username: String,
      },
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Message>('Message', MessageSchema);
