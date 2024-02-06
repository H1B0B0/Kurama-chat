import { Request, Response } from 'express';
import User from '../schemas/User';

import AuthenticateUserService from '../services/AuthenticateUserService';

class SessionController {
  async store(request: Request, response: Response) {
    const { username, password } = request.body;

    const authenticateUser = new AuthenticateUserService();

    const { user, token } = await authenticateUser.execute({
      username,
      password,
    });

    await User.updateOne(
      {
        _id: user._id,
      },
      { status: 'online' }
    );

    return response.status(200).json({ user, token });
  }
}

export default SessionController;
