import { NextFunction, Request, Response } from 'express';

import { prismaClient } from '@Database';
import { throwError } from '@Errors';
import { isRequired } from './sharedValidation';


export async function transactionQueryValidationMiddleware(req: Request, _res: Response, next: NextFunction) {
  const DATE_REGEX = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/
  const query = req.query;

  if (query.date === undefined) return next();

  try {
    const date = String(query.date);
    const isDateFormatValid = DATE_REGEX.test(date);

    if (isDateFormatValid) return next();

    return throwError({ code: 'badRequest', message: 'Date format invalid' });
  } catch (error) {
    return next(error);
  }
}

export async function transactionsValidationMiddleware(req: Request, _res: Response, next: NextFunction) {
  const { username, accountId } = req.user;
  const { credited_user, cash_out } = req.body;


  try {
    isRequired(!!credited_user, 'credited_user');
    isRequired(!!cash_out, 'cash_out');

    if (username === credited_user) return throwError({
      code: 'conflict',
      message: 'debited and credited user cannot be the same',
    });

    const userAccount = await prismaClient.accounts.findUnique({
      where: {
        id: accountId,
      }
    });

    if (userAccount) {
      if (cash_out > userAccount?.balance) {
        return throwError({ code: 'badRequest', message: 'insufficient balance' });
      }
    }

    const creditedUserAccount = await prismaClient.users.findUnique({
      where: {
        username: credited_user,
      },
      include: {
        account: {
          select: {
            balance: true,
          }
        },
      }
    });

    if (!creditedUserAccount) return throwError({ code: 'badRequest', message: 'credited user not found' });

    req.creditedUser = creditedUserAccount;

    return next()

  } catch (error) {
    return next(error);
  }
}
