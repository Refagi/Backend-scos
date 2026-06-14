import type { Context, Next } from "hono";

type AsyncHandler = (c: Context, next?: Next) => Promise<Response>;

export const catchAsync = (fn: AsyncHandler) => {
  return async (c: Context, next: Next) => {
    try {
      return await fn(c, next);
    } catch (error: any) {
      throw error
    }
  };
};
