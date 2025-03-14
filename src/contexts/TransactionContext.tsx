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

interface TransactionContextType {
    transactions: Transaction[],
    fetchTransactions: (query?: string) => Promise<void>;
}

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
                q: query,
            }
        })

        setTransactions(response.data);
    }

    useEffect(() => {
        fetchTransactions()
    }, []);

    return (
        <TransactionsContext.Provider value={{
            transactions,
            fetchTransactions
        }}>
            {children}
        </TransactionsContext.Provider>
    )
}