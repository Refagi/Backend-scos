import type { MiddlewareHandler } from 'hono';
import { logger  } from '@/config/logger.js'
import { config } from '@/config/config';

class LoggerHandler {
  public getMiddleware: MiddlewareHandler;

  constructor() {
    this.getMiddleware = async (c, next) => {
      const start = Date.now();
      const method = c.req.method;
      const url = c.req.url;

      await next();

      const duration = Date.now() - start;
      const status  = c.res.status;
      const ipFormat = this.getIpFormat(c);

      if(status  < 400) {
        const message = `${ipFormat}${method} ${url} ${status} - ${duration}ms`;
        logger.info(message);
      } 
      else {
        const errorMessage = c.get('errorMessage') || '';
        const message = `${ipFormat}${method} ${url} ${status} - ${duration}ms ${errorMessage ?  `message: ${errorMessage}`: ''}`;
        logger.error(message);
      }
    }
  }
    public getIpFormat(c: any) {
        if (config.env === 'production') {
          const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '';
          return `${ip} - `;
        }
        return '';
    }
}

export const loggerHandler = new LoggerHandler().getMiddleware;
