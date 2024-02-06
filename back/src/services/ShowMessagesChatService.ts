import Message from '../schemas/Message';

class ShowMessagesChatService {
  public async execute() {
    const messages = await Message.find().sort('createdAt');

    return messages;
  }
}

export default ShowMessagesChatService;
