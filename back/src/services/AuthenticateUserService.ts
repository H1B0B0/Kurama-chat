import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '../errors/AppError';

import authConfig from '../config/auth';
import User from '../schemas/User';

interface IUser {
  _id: string;
  name: string;
  username: string;
}

interface IRequest {
  username: string;
  password: string;
}

interface IResponse {
  user: IUser;
  token: string;
}

class AuthenticateUserService {
  public async execute({ username, password }: IRequest): Promise<IResponse> {
    const user = await User.findOne({ username });

    if (!user) {
      throw new AppError('Incorrect username/password combination.', 400);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect username/password combination.', 400);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const formattedUser = {
      _id: user._id,
      name: user.name,
      username: user.username,
    };

    return {
      user: formattedUser,
      token,
    };
  }
}

export default AuthenticateUserService;
