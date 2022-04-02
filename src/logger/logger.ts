import pino, { LoggerOptions, StreamEntry } from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const streams: StreamEntry[] = [
  ...(!isDev ? [{ stream: process.stdout }] : []),
  {
    stream: pino.destination({
      dest: process.env.LOG_DIRECTORY || `${__dirname}/../../logs/combined.log`,
      mkdir: !process.env.LOG_DIRECTORY,
    }),
  },
];

const options: LoggerOptions = {
  level: 'debug',
};

export const logger = pino(options, pino.multistream(streams));
