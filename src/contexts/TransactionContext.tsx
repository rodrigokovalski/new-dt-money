import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Transaction {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    price: number;
    category: string;
    createdAt: string;
}

interface CreateTransactionInput {
    description: string,
    price: number,
    category: string,
    type: 'income' | 'outcome',
}

interface TransactionContextType {
    transactions: Transaction[],
    fetchTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TransactionsContext = createContext({} as TransactionContextType);

interface TransactionsProviderProps {
    children: ReactNode
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    async function fetchTransactions(query?: string) {
        /*
        Forma de fazer com fetch API
            const url = new URL('http://localhost:3000/transactions')

            if (query) {
                console.log(query);
                url.searchParams.append('q', query);
            }

            const response = await fetch(url)
            const data = await response.json()
        */

        const response = await api.get('transactions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query,
            }
        })

        setTransactions(response.data);
    }

    async function createTransaction(data: CreateTransactionInput) {
        const { description, price, category, type } = data;

        const response = await api.post('transactions', {
            description,
            price,
            category,
            type,
            createdAt: new Date(),
        });

        setTransactions(state => [response.data, ...state])
    }

    useEffect(() => {
        fetchTransactions()
    }, []);

    return (
        <TransactionsContext.Provider value={{
            transactions,
            fetchTransactions,
            createTransaction
        }}>
            {children}
        </TransactionsContext.Provider>
    )
}