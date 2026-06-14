import StatusCodes from "http-status-codes";
import { config } from "../config/config.js";
import { logger } from "../config/logger.js";
import { ApiError } from "../utils/ApiError.js";
import type { Context, Next } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from 'zod';
import { Prisma } from "../generated/prisma/client";
import { HTTPException } from "hono/http-exception";

class ErrorMiddleware {

  protected handlePrismaError(err: Prisma.PrismaClientValidationError | Prisma.PrismaClientKnownRequestError): ApiError {
    if(err instanceof Prisma.PrismaClientValidationError) {
      return new ApiError(StatusCodes.BAD_REQUEST, 'Invalid data. Please check your input.', true, err.stack)
    }

    const knownError = err as Prisma.PrismaClientKnownRequestError;

    switch (knownError.code) {
    case 'P2002':
      // handle duplicate key errors
      return new ApiError(StatusCodes.CONFLICT, `Data already exists.`, true, err.stack);
    case 'P2014':
      // handle invalid ID errors
      return new ApiError(StatusCodes.BAD_REQUEST, `Invalid ID`, true, err.stack);
    case 'P2003':
      // handle invalid data errors
      return new ApiError(StatusCodes.BAD_REQUEST, `Invalid input data.`, true, err.stack);
    case 'P2025':
      // handle record not found errors
      return new ApiError(StatusCodes.NOT_FOUND, `Data not found.`, true, err.stack);
    default:
      // handle all errors
      return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Something went wrong: ${err.message}`, false, err.stack);
  }
  }

  protected handleZodError(err: ZodError): ApiError {
    return new ApiError(StatusCodes.BAD_REQUEST,
    `Validation error: ${err.message}`,
    true,
    err.stack
  );
  }
}

class ErrorConverters extends ErrorMiddleware {
  private convertedError: ApiError;
  constructor(error: any){
    super();
    if (error instanceof ApiError) {
      this.convertedError = error;
      return
    }

      if (error instanceof ZodError){
        logger.info('handleZodError');
        this.convertedError = this.handleZodError(error);
      }  else if (error instanceof Prisma.PrismaClientValidationError) {
        logger.info('handlePrismaValidationError');
        this.convertedError = this.handlePrismaError(error);
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        logger.info('handlePrismaError');
        this.convertedError = this.handlePrismaError(error);
      } else {
        
        if (config.env === 'development') {
          console.error('Unhandled Error Type:', error.constructor.name);
          console.error('Error details:', error);
        }
         const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
         const message = error.message || 'Internal server error';
         this.convertedError = new ApiError(statusCode, message, false, error.stack);
      }
  }

    public getError(): ApiError {
    return this.convertedError;
  }
}

class ErrorHandlers extends ErrorMiddleware {
  private error: ApiError;
  private context: Context;

  constructor(err: Error, c: Context) {
    super();
    const convertedError = new ErrorConverters(err);
    this.error = convertedError.getError();
    this.context = c
  }

  private responseError() {
    let { statusCode, message, isOperational, stack } = this.error;

    if (config.env === 'production' && !isOperational) {
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      message = 'Something went wrong, please try again later.';
    }

    const response: any = {
      code: statusCode,
      message,
    };

    if (config.env === 'development' && stack) {
      response.stack = stack;
    }
    return { response, statusCode };
  }

  private logError() {
    const req = this.context.req;
    const method = req.method;
    const url = req.url;
    const path = req.path;

    if(config.env === 'development' ){
      console.error('Request Info:');
      console.error(`Method: ${method}`);
      console.error(`URL: ${url}`);
      console.error(`Path: ${path}`);
      console.error('Error Details:');
      console.error(`Status Code: ${this.error.statusCode}`);
      console.error(`Message: ${this.error.message}`);
      console.error(`Operational: ${this.error.isOperational}`);
    
    if (this.error.stack) {
      console.error('Stack Trace:');
      const stackLines = this.error.stack.split('\n').slice(0, 10);
      stackLines.forEach(line => console.error(`   ${line}`));
    }
    
    logger.error(this.error, {
      statusCode: this.error.statusCode,
      isOperational: this.error.isOperational,
      method,
      url,
      path,
    });
    } else {
    logger.error( this.error.message, {
      statusCode: this.error.statusCode,
      isOperational: this.error.isOperational,
      method,
      url,
      path
    });
    }
  }

  public handle() {
    this.logError();
    const { response, statusCode } = this.responseError();
    return this.context.json(response, statusCode as ContentfulStatusCode);
  }
}

export const errorConverter = (err: any) => {
  const converter = new ErrorConverters(err);
  return converter.getError();
}

export const errorHandler = (err: Error, c: Context) => {
  const handler = new ErrorHandlers(err, c);
  if (err instanceof HTTPException) {
    return c.json({code: err.status, message: err.message}, err.status);
  }
  return handler.handle();
};
