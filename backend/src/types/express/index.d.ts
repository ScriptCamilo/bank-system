import { QueryParam, User } from '../';

declare global {
  namespace Express {
    interface Request {
      user: User;
      creditedUser: User;
      token: string | undefined;
      query: QueryParam;
    }
  }
}
