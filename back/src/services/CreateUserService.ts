import User from '../schemas/User';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

interface IRequest {
  name: string;
  username: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, username, password }: IRequest) {
    const userExists = await User.findOne({ username });

    if (userExists) {
      throw new AppError('Username already exists.', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    delete user.password;

    return user;
  }
}

export default CreateUserService;
