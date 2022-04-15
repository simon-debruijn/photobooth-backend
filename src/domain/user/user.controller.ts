import { RequestHandler } from 'express';
import { BadRequest, Conflict, NotFound } from 'http-errors';

import { prismaClient } from '../../database/prisma.client';
import { userModel } from '../../database/prisma/zod';
import { createUserService } from './user.service';

const userService = createUserService({ prismaClient });

export const getUsers: RequestHandler = async (req, res) => {
  const users = await userService.getUsers();

  res.send({
    data: users,
    count: users.length,
  });
};

export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const user = await userService.getUserById(parseInt(id));

  if (!user) {
    throw new NotFound('User not found');
  }

  res.send({
    data: user,
  });
};

export const registerUser: RequestHandler = async (req, res) => {
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

export const loginUser: RequestHandler = async (req, res) => {
  const loginUserInput = req.body;

  const userCredentials = await userModel.parseAsync(loginUserInput).catch(() => {
    throw new BadRequest('Invalid login input');
  });

  const data = await userService.loginUser(userCredentials);

  res.send({
    data,
  });
};
