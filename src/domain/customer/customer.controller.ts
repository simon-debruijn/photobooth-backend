import { createCustomerService } from './customer.service';
import { prismaClient } from '../../database/prisma.client';
import { RequestHandler } from 'express';
import { customerModel } from '../../database/prisma/zod';
import { NotFound, BadRequest, Conflict } from 'http-errors';
import * as tokenProvider from '@/token/token.provider';

const customerService = createCustomerService({ prismaClient });

export const getCustomers: RequestHandler = async (req, res) => {
  const customers = await customerService.getCustomers();

  res.send({
    data: customers,
    count: customers.length,
  });
};

export const getCustomerById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const customer = await customerService.getCustomerById(parseInt(id));

  if (!customer) {
    throw new NotFound('Customer not found');
  }

  res.send({
    data: customer,
  });
};

export const registerCustomer: RequestHandler = async (req, res) => {
  const registerCustomerInput = req.body;

  const newCustomer = await customerModel.parseAsync(registerCustomerInput).catch(() => {
    throw new BadRequest('Invalid customer input data');
  });

  const foundCustomer = await customerService.getCustomerByEmail(newCustomer.email);

  if (foundCustomer) {
    throw new Conflict('An account with this email already exists');
  }

  const { password, ...customerWithoutPassword } = await customerService.registerCustomer(
    newCustomer,
  );

  res.send({
    data: customerWithoutPassword,
  });
};

export const loginCustomer: RequestHandler = async (req, res) => {
  const loginCustomerInput = req.body;

  const customerCredentials = await customerModel.parseAsync(loginCustomerInput).catch(() => {
    throw new BadRequest('Invalid login input');
  });

  const data = await customerService.loginCustomer(customerCredentials);

  res.send({
    data,
  });
};
