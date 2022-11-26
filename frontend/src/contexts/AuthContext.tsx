import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

export interface TransactionType {
  id: string;
  value: number;
  createdAt: string;
  creditedAccountId: string;
  debitedAccountId: string;
  debitedBy: {
    user: {
      username: string;
    }
  };
  creditedTo: {
    user: {
      username: string;
    }
  }
}

export interface User {
  username?: string;
  accountId?: string;
  account?: {
    balance?: number;
  }
  transactions?: TransactionType[];
}

interface ErrorType {
  isError: boolean,
  message: string,
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  error: ErrorType | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  setError: Dispatch<SetStateAction<ErrorType | null>>;
}

interface AuthProviderType {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderType) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<ErrorType | null>(null);
  const isAuthenticated = !!user;


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}
