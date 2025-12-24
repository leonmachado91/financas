"use client";

import { Transaction } from '@/types';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

// Tipos do contexto
type TransactionType = 'income' | 'expense';
type SheetMode = 'add' | 'edit';

interface TransactionSheetContextValue {
    // Estado
    isOpen: boolean;
    type: TransactionType;
    mode: SheetMode;
    editingTransaction: Transaction | null;

    // Ações
    openAddSheet: (type: TransactionType) => void;
    openEditSheet: (transaction: Transaction) => void;
    closeSheet: () => void;
}

const TransactionSheetContext = createContext<TransactionSheetContextValue | undefined>(undefined);

/**
 * Provider do contexto de TransactionSheet
 * 
 * Gerencia o estado global do sheet de transações,
 * permitindo abri-lo de qualquer página (FAB no mobile, etc.)
 */
export function TransactionSheetProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<TransactionType>('expense');
    const [mode, setMode] = useState<SheetMode>('add');
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const openAddSheet = useCallback((transactionType: TransactionType) => {
        setType(transactionType);
        setMode('add');
        setEditingTransaction(null);
        setIsOpen(true);
    }, []);

    const openEditSheet = useCallback((transaction: Transaction) => {
        setEditingTransaction(transaction);
        setType(transaction.type);
        setMode('edit');
        setIsOpen(true);
    }, []);

    const closeSheet = useCallback(() => {
        setIsOpen(false);
        // Limpar estado após animação de fechamento
        setTimeout(() => {
            setEditingTransaction(null);
        }, 300);
    }, []);

    const value: TransactionSheetContextValue = {
        isOpen,
        type,
        mode,
        editingTransaction,
        openAddSheet,
        openEditSheet,
        closeSheet,
    };

    return (
        <TransactionSheetContext.Provider value={value}>
            {children}
        </TransactionSheetContext.Provider>
    );
}

/**
 * Hook para acessar o contexto do TransactionSheet
 * 
 * @throws Error se usado fora do TransactionSheetProvider
 */
export function useTransactionSheet() {
    const context = useContext(TransactionSheetContext);
    if (!context) {
        throw new Error('useTransactionSheet must be used within a TransactionSheetProvider');
    }
    return context;
}
