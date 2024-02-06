import { Request, Response } from 'express';
import User from '../schemas/User';

import AppError from '../errors/AppError';

import CreateUserService from '../services/CreateUserService';

class UsersController {
  async index(request: Request, response: Response) {
    const users = await User.find();

    return response.status(200).json(users);
  }

  async store(request: Request, response: Response) {
    const { name, username, password } = request.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name,
      username,
      password,
    });

    return response.status(200).json({
      _id: user.id,
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin,
      status: user.status,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    let { name, email } = request.body;

    const user = await User.findById(id);

    if (!user) {
      throw new AppError('User not found');
    }

    name = name ? name : user.name;
    email = email ? email : user.username;

    await User.updateOne(
      {
        _id: id,
      },
      { name, email }
    );

    return response.status(200).json({
      _id: id,
      name,
      email,
    });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    await User.findByIdAndDelete(id);

    return response.status(200).json({ success: 'Register deleted' });
  }
}

export default UsersController;
