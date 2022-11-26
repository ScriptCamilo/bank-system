import { throwError } from '@Errors';
import { prismaClient } from '@Database';

import type { User } from '@Types';

export function isRequired(condition: boolean, field: string) {
  const message = `"${field}" is required`;
  if (!condition) {
    throwError({ code: 'badRequest', message });
  }
}

export async function isUserUnique(username: string): Promise<User | null> {
  const user = await prismaClient.users.findUnique({
    where: {
      username,
    },

    select: {
      id: true,
      username: true,
      password: true,
      accountId: true,
      account: {
        select: {
          balance: true,
        },
      },
    },
  });

  return user;
}
