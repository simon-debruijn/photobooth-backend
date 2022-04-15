import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { JWT_SECRET } from '@/constants';

export const sign = (user: Prisma.userUpdateInput): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user,
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
  Prisma.userUpdateInput
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
