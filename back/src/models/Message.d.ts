// Message.d.ts
import { Document, Model } from 'mongoose';

export interface IMessage extends Document {
  user: string;
  text: string;
  timestamp: Date;
}

export const Message: Model<IMessage>;
