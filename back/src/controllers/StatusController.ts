import { Request, Response } from 'express';
import User from '../schemas/User';

import AppError from '../errors/AppError';

class StatusController {
  async update(request: Request, response: Response) {
    const { newStatus } = request.body;

    const user = await User.findById(request.user.id);

    if (!user) {
      throw new AppError('User not found');
    }

    await User.updateOne(
      {
        _id: user._id,
      },
      { status: newStatus }
    );

    request.io.emit('changeUserStatus');

    return response
      .status(200)
      .json({ success: `status changed to: ${newStatus}` });
  }
}

export default StatusController;
