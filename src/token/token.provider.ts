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

export const verify = (token: string): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      resolve(decoded);
    } catch (err) {
      reject(err);
    }
  });
};

export const decode = (token: string): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      resolve(decoded);
    } catch (err) {
      reject(err);
    }
  });
};
