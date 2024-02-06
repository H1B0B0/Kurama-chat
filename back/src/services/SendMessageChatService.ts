import User from '../schemas/User';
import Message from '../schemas/Message';

import AppError from '../errors/AppError';

interface IRequest {
  user_id: string;
  content: string;
}

class SendMessageChatService {
  public async execute({ user_id, content }: IRequest) {
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      throw new AppError('User not exists', 400);
    }

    const message = await Message.create({
      user: { user_id, name: user.name, username: user.username },
      content,
    });

    return {
      message,
    };
  }
}

export default SendMessageChatService;
