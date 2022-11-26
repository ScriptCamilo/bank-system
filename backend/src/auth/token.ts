import jwt from 'jsonwebtoken';

import { throwError } from '@Errors';

const { JWT_SECRET } = process.env;

export function getToken(userId: string): string | undefined {
  if (JWT_SECRET) {
    const token = jwt.sign({ data: { userId } }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '24h' });
    return token;
  }

  throwError({ code: 'internalServerError', message: '' });
}

export function verifyToken(token: string | undefined) {
  try {
    if (!token || !JWT_SECRET) throw 'token not found';

    const user = jwt.verify(token, JWT_SECRET, (error, data) => {
      if (error) throw 'invalid token';

      if (typeof data === 'string' || !data) return data;

      const { data: { userId } } = data;

      return userId;
    }) as unknown;

    return user as string;
  } catch (error) {
    let message = String(error);

    throwError({ code: 'unauthorized', message });
  }
}
