import * as Dialog from '@radix-ui/react-dialog'
import { AxiosError } from 'axios'
import { IdentificationCard, Money, X } from 'phosphor-react'
import { FormEvent, ReactNode, useContext, useState } from 'react'

import { Button, Heading, Text, TextInput } from '../'
import type { TransactionType } from '../../contexts/AuthContext'
import { AuthContext } from '../../contexts/AuthContext'
import { useRequests } from '../../services'

interface PaymentType {
  children: ReactNode
}

export function Payment({ children }: PaymentType) {
  const [open, setOpen] = useState(false);
  const { setUser } = useContext(AuthContext);
  const { postRequest, isLoading } = useRequests();

  const handleCloseModal = () => {
    setOpen(false);
  }

  const handlePayment = async (event: FormEvent) => {
    event.preventDefault();

    const formValues = new FormData(event.target as HTMLFormElement);
    const formData = Object.fromEntries(formValues);

    try {
      const { data } = await postRequest<TransactionType>('/transactions/cash-out', formData);
      const value = data.value;

      setUser(prev => {
        const newValue = Number(prev?.account?.balance) - value;
        if (prev && prev.transactions) {
          return {
            ...prev,
            account: { balance: newValue },
            transactions: [{ ...data }, ...prev.transactions]
          }
        }

        return {
          ...prev,
          account: { balance: newValue },
          transactions: [{ ...data }],
        }
      });
      alert('Sucesso!')
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;
        alert(response?.data?.message);
      }
    }
    finally {
      handleCloseModal();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
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
              Pay someone simple and easy
            </Heading>
          </Dialog.Title>

          <Dialog.Description>
            <Text size="md" className="text-[#6F6E77]">
            NG.CASH, after the point, comes a new beginning.
            We came to help you build your financial independence, regardless of your age.
            </Text>
          </Dialog.Description>

          <form
            onSubmit={handlePayment}
            className="flex flex-col gap-4 items-stretch w-full max-w-sm mt-6"
          >
            <label htmlFor="pay-username" className="flex flex-col gap-3">
              <TextInput.Root className="ring-ng-green-main bg-gray-200">
                <TextInput.Icon>
                  <IdentificationCard />
                </TextInput.Icon>
                <TextInput.Input type="text" id="pay-username" name="credited_user" placeholder="Username" />
              </TextInput.Root>
            </label>

            <label htmlFor="pay-=value" className="flex flex-col gap-3">
              <TextInput.Root className="ring-ng-green-main bg-gray-200">
                <TextInput.Icon>
                  <Money />
                </TextInput.Icon>
                <TextInput.Input type="number" id="pay-=value" name="cash_out" placeholder="Payment" />
              </TextInput.Root>
            </label>

            <Button disabled={isLoading} type="submit" className="ring-black mt-4 bg-ng-green-main hover:bg-ng-green-hover">
              Add new transaction
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
