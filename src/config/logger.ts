import { config } from '@/config/config';
import pino from "pino";

class Logger {
  private logger: pino.Logger;
  private isDev = config.env === 'development';
  constructor() {
    this.logger = pino({
      level: this.isDev ? 'debug' : 'info',
      serializers: {
        err: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
      },
      transport: this.isDev ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
        }
      } : undefined,
      formatters: !this.isDev ?  {
        level(label) {
          return { level: label }
        }
      } : undefined
    });
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(meta || {}, message);
  }

  info(message: string, meta?: Record<string, any>) {
    this.logger.info(meta || {}, message);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(meta || {}, message);
  }

  error(messageOrError: string | Error, meta?: Record<string, any>) {
    if (messageOrError instanceof Error) {
      this.logger.error({ err: messageOrError, ...meta }, messageOrError.message);
    } else {
      this.logger.error(meta || {}, messageOrError);
    }
  }

  getInstance() {
    return this.logger;
  }
}

export const logger = new Logger();
