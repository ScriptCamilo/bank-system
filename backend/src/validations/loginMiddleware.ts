import { NextFunction, Request, Response } from 'express';

import { comparePassword, getPasswordHash } from '@Authentication';
import { throwError } from '@Errors';
import type { User } from '@Types';
import { isRequired, isUserUnique } from './sharedValidation';

async function loginMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    if (username) req.body.username = String(username).toLowerCase();
    const user = await verifyUsername(username);

    if (user) {
      const passwordArgs = {
        password,
        storedPassword: user.password,
      }

      await verifyPassword(passwordArgs);

      delete user.password;
      req.user = { ...user };
      return next();
    }

    const passwordHash = await verifyPassword({ password });
    req.body = { ...req.body, password: passwordHash };
    return next()

  } catch (error) {
    return next(error);
  }
}

export async function verifyUsername(username: string): Promise<User | null> {
  const message = '"username" length must be at least 3 characters long';
  const isUsername = !!username;

  isRequired(isUsername, 'username');

  if (username.length < 3) {
    throwError({ code: 'badRequest', message });
  }

  return isUserUnique(username);
}

export interface PasswordVerification {
  password: string;
  storedPassword?: string;
}

export async function verifyPassword(args: PasswordVerification ): Promise<string> {
  let message = '"password" length must be at least 8 characters long';
  const { password, storedPassword } = args;
  const isPassword = !!password;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  const isRegexValid = passwordRegex.test(password);

  isRequired(isPassword, 'password');

  if (password.length < 8) {
    throwError({ code: 'badRequest', message });
  }

  if (!isRegexValid) {
    message = '"password" must have at least one number and one upper case letter'
    throwError({ code: 'badRequest', message });
  }

  if (storedPassword) {
    const isPasswordTrue = await comparePassword(password, storedPassword);
    message = 'username or password is invalid';

    if(!isPasswordTrue) {
      throwError({ code: 'unauthorized', message });
    }
  }

  return getPasswordHash(password);
}

export default loginMiddleware;
