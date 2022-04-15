/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { logger } from './logger/logger';

export const PORT = process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const SALT_ROUNDS = (
  process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : undefined
)!;
export const LOG_DIRECTORY = process.env.LOG_DIRECTORY!;
export const IMAGES_DIRECTORY = process.env.IMAGES_DIRECTORY;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const HASH_ID_SALT = process.env.HASH_ID_SALT!;

Object.entries({
  DATABASE_URL,
  SALT_ROUNDS,
  LOG_DIRECTORY,
  IMAGES_DIRECTORY,
  JWT_SECRET,
  HASH_ID_SALT,
}).forEach(([variableName, variableValue]) => {
  if (!variableValue) {
    logger.warn(`Environment variable ${variableName} is undefined`);
  }
});
