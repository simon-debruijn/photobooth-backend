import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BadRequest } from 'http-errors';

import { SALT_ROUNDS } from '@/constants';
import * as tokenProvider from '@/token/token.provider';

type Dependencies = {
  prismaClient: PrismaClient;
};

const userWithoutPassword = { email: true, id: true };

export const createUserService = ({ prismaClient }: Dependencies) => {
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

  const addTokenToUserById = async (id: number, previousTokens: string[], token: string) => {
    const newTokens = [...previousTokens, token];

    return await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        tokens: newTokens,
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

    console.log({ foundUser });

    if (!foundUser) {
      throw new BadRequest('Invalid login credentials');
    }

    const isPasswordValid = await bcrypt.compare(userCredentials.password, foundUser.password);

    if (!isPasswordValid) {
      throw new BadRequest('Invalid login credentials');
    }

    const { password, tokens, ...userWithoutPasswordAndTokens } = foundUser;

    // generate token
    const token = await tokenProvider.sign(userWithoutPasswordAndTokens);

    const updatedUser = await addTokenToUserById(foundUser.id, foundUser.tokens, token);

    return {
      user: {
        ...userWithoutPasswordAndTokens,
        tokens: updatedUser.tokens,
      },
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

export type UserService = ReturnType<typeof createUserService>;
