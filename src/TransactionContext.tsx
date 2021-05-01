import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "./services/api";

interface Transactions {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

{/*interface TransactionInput {
    title: string;
    amount: number;
    type: string;
    category: string;
}*/}

type TransactionInput = Omit<Transactions, 'id' | 'createdAt'>;
// Pick é o contrario de Transactions

interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionsContextData {
    transactions: Transactions[];
    createTransaction: (Transactions: TransactionInput) => void;
}

export const TransactionContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transactions[]>([]);

    useEffect(() => {
        async function loadApi() {
            api.get('transactions')
                .then(response => setTransactions(response.data.transactions))
        }

        loadApi();
    }, [])

    function createTransaction(transaction: TransactionInput) {
        api.post('/transactions', transaction);
    }
    
    return(
        <TransactionContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}