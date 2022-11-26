import { NextFunction, Request, Response } from 'express';

import { getToken } from '@Authentication';
import { throwError } from '@Errors';
import { getStatusCode } from '@Utils';

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throwError({ code: 'notFound', message: "User not found, don't have an account? Sign up!"})
    }

    const token = getToken(req.user.id);

    return res.status(getStatusCode('ok')).json({
      token,
      ...req.user,
    });
  } catch (error) {
    return next(error);
  }
}

export default login;
