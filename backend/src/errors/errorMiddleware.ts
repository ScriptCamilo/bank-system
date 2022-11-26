import { NextFunction, Request, Response } from 'express';
import { CustomError } from './throwError';

interface ErrorObject extends CustomError {
}

function errorMiddleware(err: ErrorObject, _req: Request, res: Response, _next: NextFunction) {
  const { status, message } = err;
  const statusCode = status || 500;


  if (statusCode === 500) {
    console.error(err);
    return res.status(statusCode).json({
      message: 'Internal server error, if it persists please contact us.',
    });
  }

  return res.status(statusCode).json({
    message,
  });
}

export default errorMiddleware;
