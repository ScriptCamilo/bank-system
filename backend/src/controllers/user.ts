import { NextFunction, Request, Response } from 'express';

import { getStatusCode } from '@Utils';

async function user(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(getStatusCode('ok')).json({
      ...req.user,
    });
  } catch (error) {
    return next(error);
  }
}

export default user;
