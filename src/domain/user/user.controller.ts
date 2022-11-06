import { RequestHandler } from 'express';
import { BadRequest, Conflict, NotFound, Unauthorized } from 'http-errors';

import { getTokenFromRequest } from '@/auth/getJwtFromRequest';
import { UserService, userService } from '@/domain/user/user.service';
import { tokenProvider } from '@/token/token.provider';

import { userModel } from '../../database/prisma/zod';

type Dependencies = { userService: UserService };

const createUserController = ({ userService }: Dependencies) => {
  const getUsers: RequestHandler = async (req, res) => {
    const users = await userService.getUsers();

    res.send({
      data: users,
      count: users.length,
    });
  };

  const getUserById: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const user = await userService.getUserById(parseInt(id));

    if (!user) {
      throw new NotFound('User not found');
    }

    res.send({
      data: user,
    });
  };

  const getMe: RequestHandler = async (req, res) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new Unauthorized('Invalid token');
    }

    const { id } = (await tokenProvider.verify(token)) ?? {};

    const user = await userService.getUserById(parseInt(id));

    if (!user) {
      throw new NotFound('User not found');
    }

    res.send({
      data: user,
    });
  };

  const registerUser: RequestHandler = async (req, res) => {
    const registerUserInput = req.body;

    const newUser = await userModel.parseAsync(registerUserInput).catch(() => {
      throw new BadRequest('Invalid user input data');
    });

    const foundUser = await userService.getUserByEmail(newUser.email);

    if (foundUser) {
      throw new Conflict('An account with this email already exists');
    }

    const { password, ...userWithoutPassword } = await userService.registerUser(newUser);

    res.status(201).send({
      data: userWithoutPassword,
    });
  };

  const loginUser: RequestHandler = async (req, res) => {
    const loginUserInput = req.body;

    const userCredentials = await userModel.parseAsync(loginUserInput).catch(() => {
      throw new BadRequest('Invalid login input');
    });

    const data = await userService.loginUser(userCredentials);

    res.send({
      data,
    });
  };

  return {
    getUsers,
    getUserById,
    getMe,
    registerUser,
    loginUser,
  };
};

export const __TESTS__ = {
  createUserController,
};

export const userController = createUserController({ userService, logger });
