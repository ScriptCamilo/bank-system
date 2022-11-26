import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
}

export function Button({ children, asChild, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      {...props}
      className={clsx(
        'py-3 px-4 bg-ng-purple-main rounded font-bold text-white text-lg w-full transition-colors hover:bg-ng-purple-hover focus:ring-2 ring-white',
        className,
      )}
    >
      {children}
    </Comp>
  )
}
