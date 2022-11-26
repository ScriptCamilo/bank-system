import { getStatusCode } from '@Utils';
import type { StatusCode } from '@Utils';

interface ThrowError {
  code: StatusCode;
  message: string;
}

export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

function throwError({ code, message }: ThrowError) {
  const status = getStatusCode(code);
  const error = new CustomError(message, status);

  throw error;
}

export default throwError;
