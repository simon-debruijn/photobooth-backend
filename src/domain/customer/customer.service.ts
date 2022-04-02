import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { JWT_SECRET, SALT_ROUNDS } from '@/constants';
import { BadRequest } from 'http-errors';
import * as tokenProvider from '@/token/token.provider';

type Dependencies = {
  prismaClient: PrismaClient;
};

const customerWithoutPassword = { email: true, id: true };

export const createCustomerService = ({ prismaClient }: Dependencies) => {
  const getCustomers = async () => {
    return await prismaClient.customer.findMany({
      select: { email: true, id: true },
    });
  };

  const getCustomerById = async (id: number) => {
    return await prismaClient.customer.findUnique({
      where: {
        id,
      },
      select: customerWithoutPassword,
    });
  };

  const getCustomerByEmail = async (email: string) => {
    return await prismaClient.customer.findFirst({
      where: {
        email,
      },
    });
  };

  const addTokenToCustomerById = async (id: number, previousTokens: string[], token: string) => {
    const newTokens = [...previousTokens, token];

    return await prismaClient.customer.update({
      where: {
        id,
      },
      data: {
        tokens: newTokens,
      },
    });
  };

  const registerCustomer = async (newCustomer: Prisma.customerCreateInput) => {
    const hashedPassword = await bcrypt.hash(newCustomer.password, SALT_ROUNDS);

    const customerWithHashedPassword = {
      ...newCustomer,
      password: hashedPassword,
    };

    return await prismaClient.customer.create({ data: customerWithHashedPassword });
  };

  const loginCustomer = async (customerCredentials: Prisma.customerCreateInput) => {
    const foundCustomer = await getCustomerByEmail(customerCredentials.email);

    console.log({ foundCustomer });

    if (!foundCustomer) {
      throw new BadRequest('Invalid login credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      customerCredentials.password,
      foundCustomer.password,
    );

    if (!isPasswordValid) {
      throw new BadRequest('Invalid login credentials');
    }

    const { password, tokens, ...customerWithoutPasswordAndTokens } = foundCustomer;

    // generate token
    const token = await tokenProvider.sign(customerWithoutPasswordAndTokens);

    const updatedCustomer = await addTokenToCustomerById(
      foundCustomer.id,
      foundCustomer.tokens,
      token,
    );

    return {
      customer: {
        ...customerWithoutPasswordAndTokens,
        tokens: updatedCustomer.tokens,
      },
      token,
    };
  };

  return {
    getCustomers,
    registerCustomer,
    loginCustomer,
    getCustomerById,
    getCustomerByEmail,
  };
};

export type CustomerService = ReturnType<typeof createCustomerService>;
