import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

import { JWT_EXPIRES_IN, JWT_SECRET } from '@/constants';

export const createTokenProvider = () => {
  const sign = (user: Prisma.userUpdateInput): Promise<string> => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        user,
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN || '1d',
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

  const verify = (token: string): Promise<jwt.JwtPayload> => {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        resolve(decoded);
      } catch (err) {
        reject(err);
      }
    });
  };

  const decode = (token: string): Promise<jwt.JwtPayload> => {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.decode(token) as jwt.JwtPayload;
        resolve(decoded);
      } catch (err) {
        reject(err);
      }
    });
  };

  return {
    sign,
    verify,
    decode,
  };
};

export const tokenProvider = createTokenProvider();
