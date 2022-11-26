import * as Dialog from '@radix-ui/react-dialog'
import { AxiosError } from 'axios'
import Router from 'next/router'
import { setCookie } from 'nookies'
import { IdentificationCard, Lock, X } from 'phosphor-react'
import { FormEvent, ReactNode, useContext } from 'react'

import { Button, Heading, Text, TextInput } from '..'
import { AuthContext } from '../../contexts/AuthContext'
import { LoginInfosType } from '../../pages'
import { useRequests } from '../../services'

interface SignupType {
  children: ReactNode
}

export function Signup({ children }: SignupType) {
  const { setUser } = useContext(AuthContext);
  const { postRequest, isLoading } = useRequests();
  const passwordPlaceholder = '\u2217'.repeat(8);

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();

    const formValues = new FormData(event.target as HTMLFormElement);
    const formData = Object.fromEntries(formValues);

    try {
      const { data } = await postRequest<LoginInfosType>('/signup', formData);

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
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-white/10 inset-0 fixed" />
        <Dialog.Content className="fixed bg-white py-10 px-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
          <Dialog.Close asChild>
            <button
              className="rounded-full h-6 w-6 inline-flex items-center justify-center absolute top-3 right-3 hover:bg-black hover:bg-opacity-20"
              aria-label="Close"
            >
              <X color="black" />
            </button>
          </Dialog.Close>

          <Dialog.Title asChild>
            <Heading className="text-current text-3xl font-black mb-2">
              Sign up
            </Heading>
          </Dialog.Title>

          <Dialog.Description>
            <Text size="md" className="text-[#6F6E77]">
              Let&apos;s build the future.
            </Text>
          </Dialog.Description>

          <form
            onSubmit={handleSignup}
            className="flex flex-col gap-4 items-stretch w-full max-w-sm mt-6"
          >
            <label htmlFor="signin-username" className="flex flex-col gap-3">
              <TextInput.Root className="ring-ng-green-main bg-gray-200">
                <TextInput.Icon>
                  <IdentificationCard />
                </TextInput.Icon>
                <TextInput.Input type="text" id="signin-username" name="username" placeholder="Username" />
              </TextInput.Root>
            </label>

            <label htmlFor="signin-password" className="flex flex-col gap-3">
              <TextInput.Root className="ring-ng-green-main bg-gray-200">
                <TextInput.Icon>
                  <Lock />
                </TextInput.Icon>
                <TextInput.Input type="password" id="signin-password" name="password" placeholder={passwordPlaceholder} />
              </TextInput.Root>
            </label>

            <Button disabled={isLoading} type="submit" className="ring-black mt-4 bg-ng-green-main hover:bg-ng-green-hover">
              Create new account
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
