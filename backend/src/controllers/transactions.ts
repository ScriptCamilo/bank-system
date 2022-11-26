import { NextFunction, Request, Response } from 'express';

import { prismaClient } from '@Database';
import { getStatusCode } from '@Utils';

const INCLUDE_QUERY = {
  debitedBy: {
    select: {
      user: {
        select: {
          username: true,
        }
      }
    }
  },
  creditedTo: {
    select: {
      user: {
        select: {
          username: true,
        }
      }
    }
  }
};

export async function createNewTransaction(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  const creditedUserAccount = req.creditedUser;
  const { cash_out } = req.body;
  const lastRecord = await prismaClient.transactions.findFirst({
    orderBy: {
      createdAt: 'desc'
    }
  });

  try {
    const newTransaction = await prismaClient.transactions.create({
      data: {
        debitedAccountId: user.accountId,
        creditedAccountId: creditedUserAccount.accountId,
        value: parseFloat(cash_out),
      },

      include: {
        creditedTo: {
          select: {
            user: {
              select: {
                username: true,
              }
            }
          }
        },
        debitedBy: {
          select: {
            user: {
              select: {
                username: true,
              }
            }
          }
        }
      }
    });

    await prismaClient.accounts.update({
      where: {
        id: user.accountId,
      },
      data: {
        balance: {
          decrement: parseFloat(cash_out),
        }
      }
    });

    await prismaClient.accounts.update({
      where: {
        id: creditedUserAccount.accountId,
      },
      data: {
        balance: {
          increment: parseFloat(cash_out),
        }
      }
    });

    return res.status(getStatusCode('ok')).json(newTransaction);
  } catch (error) {
    const newFailRecord = await prismaClient.transactions.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });

    if ((lastRecord?.id !== newFailRecord?.id) && newFailRecord) {
      await prismaClient.transactions.delete({
        where: {
          id: newFailRecord?.id,
        }
      });
    }

    return next(error);
  }
}

export async function getTransactionsQuery(req: Request, res: Response, next: NextFunction) {
  const { accountId } = req.user;
  const query = req.query;

  try {
    if (query.date  || query.type) {
      const date = query.date ? new Date(String(query.date)) : undefined;
      const nextDate = query.date ? new Date(String(query.date)) : undefined;

      if (date) nextDate?.setDate(date.getDate() + 1);

      const type = String(query.type);

      switch(true) {
        case type === 'cash-in' && !!date: {
          const queryTransactions = await prismaClient.transactions.findMany({
            where: {
              AND: {
                createdAt: {
                  gte: date,
                  lt: nextDate,
                },
                creditedAccountId: {
                  equals: accountId,
                }
              },
            },
            include: INCLUDE_QUERY,
            orderBy: {
              createdAt: 'desc',
            }
          });
          return res.status(getStatusCode('ok')).json(queryTransactions);
        }

        case type === 'cash-in' && !date: {
          const queryTransactions = await prismaClient.transactions.findMany({
            where: {
                creditedAccountId: { equals: accountId },
            },

            include: INCLUDE_QUERY,
            orderBy: {
              createdAt: 'desc',
            }
          });
          return res.status(getStatusCode('ok')).json(queryTransactions);
        }

        case type === 'cash-out' && !!date: {
          const queryTransactions = await prismaClient.transactions.findMany({
            where: {
              AND: {
                createdAt: {
                  gte: date,
                  lt: nextDate,
                },
                debitedAccountId: {
                  equals: accountId,
                }
              },
            },
            include: INCLUDE_QUERY,
            orderBy: {
              createdAt: 'desc',
            }
          });
          return res.status(getStatusCode('ok')).json(queryTransactions);
        }

        case type === 'cash-out' && !date: {
          const queryTransactions = await prismaClient.transactions.findMany({
            where: {
                debitedAccountId: { equals: accountId },
            },

            include: INCLUDE_QUERY,
            orderBy: {
              createdAt: 'desc',
            }
          });
          return res.status(getStatusCode('ok')).json(queryTransactions);
        }

        default: {
          const queryTransactions = await prismaClient.transactions.findMany({
            where: {
              AND: {
                createdAt: {
                  gte: date,
                  lt: nextDate,
                },
                OR: [
                  { debitedAccountId: { equals: accountId } },
                  { creditedAccountId: { equals: accountId } },
                ]
              }
            },

            include: INCLUDE_QUERY,
            orderBy: {
              createdAt: 'desc',
            }
          });
          return res.status(getStatusCode('ok')).json(queryTransactions);
        }
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export async function getTransactions(req: Request, res: Response, next: NextFunction) {
  const { accountId } = req.user;

  try {
    const transactions = await prismaClient.transactions.findMany({
      where: {
        OR: [
          { creditedAccountId: { equals: accountId } },
          { debitedAccountId: { equals: accountId } },
        ],
      },

      include: INCLUDE_QUERY,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(getStatusCode('ok')).json(transactions);
  } catch (error) {
    return next(error);
  }


}
