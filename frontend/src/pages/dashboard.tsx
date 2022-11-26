import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { destroyCookie } from 'nookies';
import { CurrencyCircleDollar, SignOut } from 'phosphor-react';
import { useContext, useEffect, useState } from 'react';

import { Button, Heading, Logo, Payment, Table, Text } from '../components';
import { Filters } from '../components/Filters/Filters';
import { AuthContext, User } from '../contexts/AuthContext';
import { httpClient, useRequests } from '../services';

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const [balance, setBalance] = useState(user?.account?.balance);
  const { getRequest } = useRequests();

  const handleLogout = () => {
    const leaving = confirm('Are you sure that you wanna leave?');

    if (leaving) {
      destroyCookie(undefined, 'token');
      Router.push('/');
    };
  }

  useEffect(() => {
    const request = async () => {
      const { data } = await getRequest<User>('user');
      setUser(data);
    }

    if (!user) request();
  }, []);

  useEffect(() => {
    setBalance(user?.account?.balance);
  }, [user?.account?.balance]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col justify-between text-gray-100">
      <header className="bg-black py-4 px-6 flex justify-between items-center">
        <Logo />

        <div className="flex flex-col justify-around">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CurrencyCircleDollar size={24}/>
              <Text size="lg" className="text-ng-purple-main font-semibold">
                {balance?.toFixed(2)}
              </Text>
            </div>
            <Button onClick={handleLogout} className="rounded-full">
              <SignOut size={24} />
            </Button>
          </div>

          <Heading className="text-ng-purple-main">
            My Finances
          </Heading>
        </div>
      </header>

      <main className="bg-white h-full py-12 px-8 md:px-32">
        <section className="grid grid-cols-filter max-w-3xl gap-8">
          <div className="flex flex-col gap-2">
            <Heading size="lg" asChild className="text-black">
              <h1>My account</h1>
            </Heading>

            <Text className="text-ng-gray-main">
              Welcome back, <span className="font-bold">{user?.username}</span>
            </Text>

            <Payment>
              <Button className="max-w-xs rounded-full max-h-12">
                New payment
              </Button>
            </Payment>
          </div>

          <Filters />
        </section>

        <section className="max-w-3xl mt-12">
          <div className="grid grid-cols-4 gap-4">
            <Text size="lg" className="text-black font-semibold">Username</Text>
            <Text size="lg" className="text-black font-semibold">Date</Text>
            <Text size="lg" className="text-black font-semibold">Cash-in/Cash-out</Text>
            <Text size="lg" className="text-black font-semibold">Amount</Text>
          </div>
          <Table />
        </section>
      </main>

      <footer className="bg-black py-4 px-4 text-center">
        <small>© NG.CASH SERVIÇOS FINANCEIROS LTDA.</small>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { httpClient: apiClient, token } = httpClient(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { },
  }
}
