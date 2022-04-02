import { Router } from 'express';
import * as customerController from './customer.controller';
import * as orderController from '../order/order.controller';

export const customerRouter = Router();

customerRouter.get('/', customerController.getCustomers);
customerRouter.get('/:id', customerController.getCustomerById);
customerRouter.get('/:customerId/orders', orderController.getOrdersForCustomerId);
customerRouter.post('/register', customerController.registerCustomer);
customerRouter.post('/login', customerController.loginCustomer);
