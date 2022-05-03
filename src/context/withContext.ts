import { context } from './context';

export const withContext = <T>(
  handler: T extends (...args: infer P) => infer R
    ? (ctx: typeof context) => (...args: P) => R
    : never,
) => {
  return handler(context) as ReturnType<typeof handler>;
};
