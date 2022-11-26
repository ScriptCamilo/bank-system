export interface User {
  id: string;
  username: string;
  password?: string;
  accountId: string;
}

export interface QueryParam {
  date: string | undefined;
  type: 'cash-in' | 'cash-out';
}

