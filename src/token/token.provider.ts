import { JWT_SECRET } from '@/constants';
import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const sign = (customer: Prisma.customerUpdateInput): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      customer,
      JWT_SECRET,
      {
        expiresIn: '1d',
        algorithm: 'HS256',
      },
      (err, encoded) => {
        if (err || !encoded) {
          return reject(err ?? new Error('encoded value is empty'));
        }
        resolve(encoded);
      },
    );
  });
};

export const verify = promisify<
  string,
  jwt.Secret,
  jwt.VerifyOptions | undefined,
  Prisma.customerUpdateInput
>(jwt.verify);

export const decode = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    new Promise((resolve) => {
      try {
        const decoded = jwt.decode(token);
        resolve(decoded);
      } catch (err) {
        reject(err);
      }
    });
  });
};
