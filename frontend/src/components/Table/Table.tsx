import { useContext, useEffect, useState } from 'react';

import { Row, Text } from '../';
import { AuthContext, TransactionType } from '../../contexts/AuthContext';
import { useRequests } from '../../services';

export function Table() {
  const { user, setUser } = useContext(AuthContext);
  const [transactions, setTransactions] = useState(user?.transactions);
  const { getRequest, isLoading } = useRequests();

  useEffect(() => {
    const request = async () => {
      const { data } = await getRequest<TransactionType[]>('transactions');
      setUser(prevState => {
        if (prevState) return {
          ...prevState,
          transactions: data,
        }
        return prevState;
      });
    }

    if (!user?.transactions) request();
  }, []);

  useEffect(() => {
    setTransactions(user?.transactions);
  }, [user])

  return (
    <div>
      {isLoading ? <Text>Carregando...</Text> : (
        <>
          {transactions?.map((item, index) => {
            const gray = index % 2 === 0 ? 'bg-gray-200 rounded' : '';

            return <Row key={item.id} { ...item } classNameProp={gray} />
          })}
        </>
      )}
    </div>
  );
}
