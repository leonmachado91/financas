"use client";

import { useTransactionSheet } from '@/contexts/TransactionSheetContext';
import { useCategories } from '@/hooks/useCategories';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useTransactionMutations } from '@/hooks/useTransactions';
import { mapProfileToDb } from '@/services/transactionsService';
import { toast } from 'sonner';
import { TransactionSheet } from './TransactionSheet';

function mapProfileFromDb(profile: string | null | undefined): 'Leonardo' | 'Flavia' | null {
    if (profile === 'Flávia' || profile === 'Flavia') return 'Flavia';
    if (profile === 'Leonardo') return 'Leonardo';
    return null;
}

/**
 * GlobalTransactionSheet - Componente que renderiza o TransactionSheet
 * baseado no estado do TransactionSheetContext.
 * 
 * Deve ser colocado em uma página ou layout que precise do sheet.
 * Funciona independentemente da página atual.
 */
export function GlobalTransactionSheet() {
    const {
        isOpen,
        type,
        mode,
        editingTransaction,
        closeSheet
    } = useTransactionSheet();

    const { data: categories = [] } = useCategories();
    const { data: paymentMethods = [] } = usePaymentMethods();
    const { create, update, isLoading } = useTransactionMutations();

    const handleSave = async (data: {
        description: string;
        amount: number;
        date: string;
        categoryId: string | null;
        paymentMethodId: string | null;
        profile: 'Leonardo' | 'Flavia' | null;
        isPaid: boolean;
    }) => {
        try {
            if (mode === 'add') {
                await create.mutateAsync({
                    description: data.description,
                    amount: data.amount,
                    date: data.date,
                    type: type,
                    status: data.isPaid ? 'paid' : 'pending',
                    category_id: data.categoryId,
                    payment_method_id: data.paymentMethodId,
                    profile: mapProfileToDb(data.profile) as 'Leonardo' | 'Flavia' | null,
                });
                toast.success('Transação adicionada!');
            } else if (editingTransaction) {
                await update.mutateAsync({
                    id: editingTransaction.id,
                    updates: {
                        description: data.description,
                        amount: data.amount,
                        date: data.date,
                        status: data.isPaid ? 'paid' : 'pending',
                        category_id: data.categoryId,
                        payment_method_id: data.paymentMethodId,
                        profile: mapProfileToDb(data.profile) as 'Leonardo' | 'Flavia' | null,
                    },
                });
                toast.success('Transação atualizada!');
            }
            closeSheet();
        } catch (error) {
            toast.error('Erro ao salvar transação');
        }
    };

    return (
        <TransactionSheet
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) closeSheet();
            }}
            type={type}
            mode={mode}
            initialData={
                editingTransaction
                    ? {
                        description: editingTransaction.description,
                        amount: editingTransaction.amount,
                        date: editingTransaction.date,
                        categoryId: editingTransaction.category_id,
                        paymentMethodId: editingTransaction.payment_method_id,
                        profile: mapProfileFromDb(editingTransaction.profile),
                        isPaid: editingTransaction.status === 'paid',
                    }
                    : undefined
            }
            categories={categories}
            paymentMethods={paymentMethods}
            onSave={handleSave}
            isLoading={isLoading}
        />
    );
}
