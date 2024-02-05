import mongoose, { Schema, Document, Model } from 'mongoose';

interface IMessageItem {
  timestamp: Date;
  content: string;
}

// Interface for the document structure
interface IMessageDocument extends Document {
  messages: IMessageItem[];
}

const messageItemSchema = new Schema<IMessageItem>({
  timestamp: { type: Date, required: true },
  content: { type: String, required: true }
});

const messageSchema = new Schema<IMessageDocument>({
  messages: [messageItemSchema]
});

const MessageModel: Model<IMessageDocument> = mongoose.model('Message', messageSchema);

export default MessageModel;
