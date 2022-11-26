import { Request, Response, NextFunction } from 'express';

import { getStatusCode } from '@Utils';
import { prismaClient } from '@Database';

async function account(req: Request, res: Response, next: NextFunction) {
  try {
    const { accountId } = req.user;
    const userAccount = await prismaClient.accounts.findUnique({
      where: {
        id: accountId,
      }
    });

    return res.status(getStatusCode('ok')).json(userAccount);
  } catch (error) {
    return next(error);
  }
}

export default account;
