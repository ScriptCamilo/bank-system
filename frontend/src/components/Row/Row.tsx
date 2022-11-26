import { useContext } from 'react';

import { Text } from '../';
import { AuthContext, TransactionType } from '../../contexts/AuthContext';

interface RowProps extends TransactionType {
  classNameProp: string;
}

export function Row({ debitedBy, creditedTo, value, createdAt, classNameProp }: RowProps) {
  const { user } = useContext(AuthContext);
  const { user: { username: debitUser } } = debitedBy;
  const { user: { username: creditUser } } = creditedTo;
  const date = new Date(createdAt).toLocaleDateString();
  const transactionType = user?.username === debitUser ? 'cash-out' : 'cash-in'
  const isCashOut = transactionType === 'cash-out';
  const username = isCashOut ? creditUser : debitUser;
  const classname = isCashOut ? 'text-red-700' : 'text-ng-green-main';

  return (
    <div className={`grid grid-cols-4 gap-4 px-2 py-1 ${classNameProp}`}>
      <Text size="lg" className="text-black">
        {username}
      </Text>

      <Text size="lg" className="text-black">
        {date}
      </Text>

      <Text size="lg" className={classname}>
        {transactionType}
      </Text>

      <Text size="lg" className={classname}>
      {isCashOut ? '-' : '+'} R${value.toFixed(2)}
      </Text>
    </div>
  );
}
