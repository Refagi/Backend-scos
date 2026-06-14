import xss from 'xss';
import type { MiddlewareHandler } from 'hono';

const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return xss(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }

  return obj;
};

export const xssSanitizeMiddleware: MiddlewareHandler = async (c, next) => {
  const contentType = c.req.header('content-type') ?? '';

  if (contentType.includes('application/json')) { //body
    const body = await c.req.json().catch(() => null);
    if (body) {
      c.set('sanitizedBody', sanitizeObject(body));
    }
  }

  const query = c.req.query(); //query
  if (query && Object.keys(query).length) {
    c.set('sanitizedQuery', sanitizeObject(query));
  }

  const params = c.req.param(); //params
  if (params && Object.keys(params).length) {
    c.set('sanitizedParams', sanitizeObject(params));
  }

  await next();
};
