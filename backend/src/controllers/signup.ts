import { NextFunction, Request, Response } from 'express';

import { getToken } from '@Authentication';
import { prismaClient } from '@Database';
import { throwError } from '@Errors';
import { getStatusCode } from '@Utils';

async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;

    if (req.user) {
      throwError({ code: 'conflict', message: 'Username already exists, please try another one!'})
    }

    const user = await prismaClient.users.create({
      data: {
        username: String(username).toLowerCase(),
        password,
        account: {
          create: {
            balance: 100,
          }
        }
      },
      select: {
        id: true,
        username: true,
        accountId: true,
      },
    });

    const token = getToken(user.id);

    return res.status(getStatusCode('created')).json({
      token,
      ...user,
    });
  } catch (error) {
    return next(error);
  }
}

export default signup;
