import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { setCookie } from 'nookies';
import { IdentificationCard, Lock } from 'phosphor-react';
import { FormEvent, useContext } from 'react';

import { Button, Logo, Signup, Text, TextInput } from '../components';
import type { User } from '../contexts/AuthContext';
import { AuthContext } from '../contexts/AuthContext';
import { httpClient, useRequests } from '../services';

export interface LoginInfosType extends User {
  token: string;
}

export default function Home() {
  const { setUser } = useContext(AuthContext);
  const { postRequest, isLoading } = useRequests();
  const passwordPlaceholder = '\u2217'.repeat(8);

  const handleLogIn = async (event: FormEvent) => {
    event.preventDefault();

    const formValues = new FormData(event.target as HTMLFormElement);
    const formData = Object.fromEntries(formValues);

    try {
      const { data } = await postRequest<LoginInfosType>('/login', formData);

      setCookie(undefined, 'token', data.token, {
        maxAge: 60 * 60 * 24, //24 hours
      });

      setUser({
        ...data
      });

      Router.push('/dashboard');
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;
        alert(response?.data?.message);
      }
    }
  };

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-gray-100">
      <header className="flex flex-col items-center">
        <Logo />

        <Text size="lg" className="text-gray-400 mt-1">
          Welcome to Ng.Cash
        </Text>
      </header>

      <form onSubmit={handleLogIn} className="flex flex-col gap-4 items-stretch w-full max-w-sm mt-10">
        <label htmlFor="username" className="flex flex-col gap-3">
          <TextInput.Root className="ring-ng-purple-main">
            <TextInput.Icon>
              <IdentificationCard  />
            </TextInput.Icon>
            <TextInput.Input type="text" id="username" name="username" placeholder="Username" />
          </TextInput.Root>
        </label>

        <label htmlFor="password" className="flex flex-col gap-3">
          <TextInput.Root className="ring-ng-purple-main">
            <TextInput.Icon>
              <Lock />
            </TextInput.Icon>
            <TextInput.Input type="password" id="password" name="password" placeholder={passwordPlaceholder} />
          </TextInput.Root>
        </label>

        <Button disabled={isLoading} type="submit" className="text-white mt-4">
          Log In
        </Button>
      </form>

      <footer className="flex flex-col items-center gap-4 mt-8">
        <Signup>
          <Text size="sm" className="text-gray-400 underline hover:text-gray-200">
            Don&apos;t have an account? Sign up
          </Text>
        </Signup>
      </footer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = httpClient(ctx);

  if (token) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  }
}
