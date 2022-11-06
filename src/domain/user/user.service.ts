import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BadRequest } from 'http-errors';

import { SALT_ROUNDS } from '@/constants';
import { prismaClient } from '@/database/prisma.client';
import { tokenProvider } from '@/token/token.provider';

type Dependencies = {
  prismaClient: PrismaClient;
};

const userWithoutPassword = { email: true, id: true };

const createUserService = ({ prismaClient }: Dependencies) => {
  const getUsers = async () => {
    return await prismaClient.user.findMany({
      select: { email: true, id: true },
    });
  };

  const getUserById = async (id: number) => {
    return await prismaClient.user.findUnique({
      where: {
        id,
      },
      select: userWithoutPassword,
    });
  };

  const getUserByEmail = async (email: string) => {
    return await prismaClient.user.findFirst({
      where: {
        email,
      },
    });
  };

  const registerUser = async (newUser: Prisma.userCreateInput) => {
    const hashedPassword = await bcrypt.hash(newUser.password, SALT_ROUNDS);

    const userWithHashedPassword = {
      ...newUser,
      password: hashedPassword,
    };

    return await prismaClient.user.create({ data: userWithHashedPassword });
  };

  const loginUser = async (userCredentials: Prisma.userCreateInput) => {
    const foundUser = await getUserByEmail(userCredentials.email);

    if (!foundUser) {
      throw new BadRequest('Invalid login credentials');
    }

    const isPasswordValid = await bcrypt.compare(userCredentials.password, foundUser.password);

    if (!isPasswordValid) {
      throw new BadRequest('Invalid login credentials');
    }

    const { password, ...userWithoutPassword } = foundUser;

    // generate token
    const token = await tokenProvider.sign(userWithoutPassword);

    return {
      user: userWithoutPassword,
      token,
    };
  };

  return {
    getUsers,
    registerUser,
    loginUser,
    getUserById,
    getUserByEmail,
  };
};

export const __TESTS__ = {
  createUserService,
};

export const userService = createUserService({ prismaClient });

export type UserService = typeof userService;
