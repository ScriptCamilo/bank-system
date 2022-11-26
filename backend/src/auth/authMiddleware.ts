import { NextFunction, Request, Response } from 'express';

import { prismaClient } from '@Database';
import { throwError } from '@Errors';
import { verifyToken } from './token';

async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;
    const userId = verifyToken(authorization);

    const user = await prismaClient.users.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        username: true,
        accountId: true,
        account: {
          select: {
            balance: true,
          }
        },
      }
    });

    if (user) {
      req.user = user;
      return next();
    }

    throwError({ code: 'unauthorized', message: 'invalid token' });
  } catch (error) {
    return next(error);
  }
}

export default authMiddleware;
