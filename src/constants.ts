/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { logger } from './logger/logger';

export const DATABASE_URL = process.env.DATABASE_URL!;
export const SALT_ROUNDS = (
  process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : undefined
)!;
export const LOG_DIRECTORY = process.env.LOG_DIRECTORY!;
export const JWT_SECRET = process.env.JWT_SECRET!;

Object.entries({ DATABASE_URL, SALT_ROUNDS, LOG_DIRECTORY, JWT_SECRET }).forEach(
  ([variableName, variableValue]) => {
    if (!variableValue) {
      logger.warn(`Environment variable ${variableName} is undefined`);
    }
  },
);
