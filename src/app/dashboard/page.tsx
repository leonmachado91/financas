"use client";

import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { EditTransactionDialog } from '@/components/dashboard/EditTransactionDialog';
import { Header } from '@/components/dashboard/Header';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TransactionItem, TransactionList } from '@/components/dashboard/TransactionList';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useCategories } from '@/hooks/useCategories';
import { useOverdueTransactions, useTransactionMutations, useTransactionsByMonth } from '@/hooks/useTransactions';
import { Transaction } from '@/types';
import { mapStatusToDB, mapStatusToUI } from '@/types/constants';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

function formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DashboardPage() {
    // Estado local da UI - null inicial para evitar hydration mismatch
    const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
    const [lateFilter, setLateFilter] = useState<'payments' | 'debts'>('debts');
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Definir data no cliente para evitar diferença servidor/cliente
    useEffect(() => {
        setSelectedMonth(new Date());
    }, []);

    // Queries do TanStack Query
    const month = selectedMonth?.getMonth() ?? 0;
    const year = selectedMonth?.getFullYear() ?? 2024;

    const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactionsByMonth(month, year);
    const { data: overdueTransactions = [], isLoading: isLoadingOverdue } = useOverdueTransactions();
    const { data: categories = [] } = useCategories();

    // Mutations
    const { create, update, delete: deleteMutation, isLoading: isMutating } = useTransactionMutations();

    // Funções auxiliares
    const getCategoryName = (id?: string | null) => {
        if (!id) return undefined;
        return categories.find(c => c.id === id)?.name;
    };

    const mapToItem = (t: Transaction): TransactionItem => ({
        id: t.id,
        title: t.description,
        amount: formatCurrency(t.amount),
        date: new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
        type: t.type === 'income' ? 'income' : 'expense',
        status: mapStatusToUI(t.status),
        categoryName: getCategoryName(t.category_id),
        profileName: t.profile ?? undefined
    });

    // Dados derivados com useMemo para performance
    const incomeItems = useMemo(() =>
        transactions.filter(t => t.type === 'income').map(mapToItem),
        [transactions, categories]
    );

    const expenseItems = useMemo(() =>
        transactions.filter(t => t.type === 'expense').map(mapToItem),
        [transactions, categories]
    );

    const lateDebtItems = useMemo(() =>
        overdueTransactions
            .filter(t => t.type === 'expense')
            .map(t => ({ ...mapToItem(t), type: 'debt' as const })),
        [overdueTransactions, categories]
    );

    const latePaymentItems = useMemo(() =>
        overdueTransactions
            .filter(t => t.type === 'income')
            .map(t => ({ ...mapToItem(t), type: 'income' as const })),
        [overdueTransactions, categories]
    );

    // Totais numéricos para o BalanceCard
    const totalIncome = useMemo(() =>
        transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
        [transactions]
    );

    const totalExpenses = useMemo(() =>
        transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
        [transactions]
    );

    const calculateTotal = (items: TransactionItem[]) => {
        const parse = (val: string) => parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'));
        const total = items.reduce((acc, item) => acc + parse(item.amount), 0);
        return formatCurrency(total);
    };

    // Handlers
    const handleAddTransaction = async (
        data: { title: string; amount: number; date: string; categoryId: string | null; paymentMethodId: string | null; profile: 'Leonardo' | 'Flavia' | null; isPaid?: boolean },
        type: 'income' | 'expense' | 'debt'
    ) => {
        const dbType = type === 'debt' ? 'expense' : type;

        try {
            await create.mutateAsync({
                description: data.title,
                amount: data.amount,
                date: data.date,
                type: dbType,
                status: data.isPaid ? 'paid' : 'pending',
                category_id: data.categoryId,
                payment_method_id: data.paymentMethodId,
                profile: data.profile,
            });
            toast.success('Transação criada com sucesso!');
        } catch (error) {
            console.error("Error creating transaction:", error);
            toast.error('Erro ao criar transação');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: 'pending' | 'completed') => {
        const newStatus = mapStatusToDB(currentStatus === 'pending' ? 'completed' : 'pending');

        try {
            await update.mutateAsync({ id, updates: { status: newStatus } });
        } catch {
            toast.error('Erro ao atualizar status');
        }
    };

    // Abre dialog de confirmação de exclusão
    const handleRequestDelete = (id: string) => {
        setDeletingId(id);
    };

    // Executa a exclusão após confirmação
    const handleConfirmDelete = async () => {
        if (!deletingId) return;

        try {
            await deleteMutation.mutateAsync(deletingId);
            toast.success('Transação excluída');
        } catch {
            toast.error('Erro ao excluir transação');
        } finally {
            setDeletingId(null);
        }
    };

    // Handler para abrir diálogo de edição
    const handleOpenEdit = (id: string) => {
        // Buscar transação em todas as listas
        const allTransactions = [...transactions, ...overdueTransactions];
        const transaction = allTransactions.find(t => t.id === id);
        if (transaction) {
            setEditingTransaction(transaction);
        }
    };

    // Handler para salvar edição
    const handleEditTransaction = async (
        id: string,
        data: { title: string; amount: number; date: string; categoryId: string | null; paymentMethodId: string | null; profile: 'Leonardo' | 'Flavia' | null; isPaid?: boolean }
    ) => {
        try {
            await update.mutateAsync({
                id,
                updates: {
                    description: data.title,
                    amount: data.amount,
                    date: data.date,
                    category_id: data.categoryId,
                    payment_method_id: data.paymentMethodId,
                    profile: data.profile,
                    status: data.isPaid ? 'paid' : 'pending',
                }
            });
            toast.success('Transação atualizada!');
            setEditingTransaction(null);
        } catch (error) {
            console.error("Error updating transaction:", error);
            toast.error('Erro ao atualizar transação');
        }
    };

    const isLoading = isLoadingTransactions || isLoadingOverdue || !selectedMonth;

    // Loading state enquanto dados inicializam
    if (!selectedMonth) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-green-500/30">
            <Sidebar />

            <div className="pl-0 md:pl-20 flex flex-col min-h-screen relative">
                <Header />

                {/* Global Loading Overlay for Mutations */}
                {isMutating && (
                    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
                    </div>
                )}

                <main className={`flex-1 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pt-0 px-4 md:px-8 pb-8 transition-opacity duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    {/* Top Section: Month Carousel */}
                    <section>
                        <MonthSelector
                            currentDate={selectedMonth}
                            onMonthChange={setSelectedMonth}
                            monthData={{
                                income: totalIncome,
                                expenses: totalExpenses,
                                balance: totalIncome - totalExpenses,
                            }}
                        />
                    </section>

                    {/* Balance Card */}
                    <section>
                        <BalanceCard
                            totalIncome={totalIncome}
                            totalExpenses={totalExpenses}
                        />
                    </section>

                    {/* Middle Section: Late Payments / Debts Selector */}
                    <section>
                        <TransactionList
                            title={lateFilter === 'debts' ? "Dívidas Atrasadas" : "Pagamentos Atrasados"}
                            total={lateFilter === 'debts' ? calculateTotal(lateDebtItems) : calculateTotal(latePaymentItems)}
                            variant="debt"
                            items={lateFilter === 'debts' ? lateDebtItems : latePaymentItems}
                            collapsible={false}
                            filterOptions={[
                                { label: 'Dívidas Atrasadas', value: 'debts' },
                                { label: 'Pagamentos Atrasados', value: 'payments' }
                            ]}
                            currentFilter={lateFilter}
                            onFilterChange={(val) => setLateFilter(val as 'payments' | 'debts')}
                            onAddTransaction={(data) => handleAddTransaction(data, lateFilter === 'debts' ? 'debt' : 'income')}
                            onToggleStatus={handleToggleStatus}
                            onEdit={handleOpenEdit}
                            onDelete={handleRequestDelete}
                        />
                    </section>

                    {/* Bottom Section: Income and Expenses */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <TransactionList
                            title="Receitas"
                            total={calculateTotal(incomeItems)}
                            variant="income"
                            items={incomeItems}
                            onAddTransaction={(data) => handleAddTransaction(data, 'income')}
                            onToggleStatus={handleToggleStatus}
                            onEdit={handleOpenEdit}
                            onDelete={handleRequestDelete}
                        />

                        <TransactionList
                            title="Despesas"
                            total={calculateTotal(expenseItems)}
                            variant="expense"
                            items={expenseItems}
                            onAddTransaction={(data) => handleAddTransaction(data, 'expense')}
                            onToggleStatus={handleToggleStatus}
                            onEdit={handleOpenEdit}
                            onDelete={handleRequestDelete}
                        />
                    </section>
                </main>
            </div>

            {/* Edit Transaction Dialog */}
            {editingTransaction && (
                <EditTransactionDialog
                    open={!!editingTransaction}
                    onOpenChange={(open) => !open && setEditingTransaction(null)}
                    transaction={editingTransaction}
                    onSave={handleEditTransaction}
                />
            )}

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={!!deletingId}
                onOpenChange={(open) => !open && setDeletingId(null)}
                title="Excluir transação?"
                description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                variant="danger"
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
