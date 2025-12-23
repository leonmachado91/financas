"use client";

import { BalanceCard } from '@/components/dashboard/BalanceCardNew';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { CategoryTabs } from '@/components/dashboard/CategoryTabs';
import { MiniStatsCard } from '@/components/dashboard/MiniStatsCard';
import { OverdueAlert } from '@/components/dashboard/OverdueAlert';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TransactionGroup, TransactionRow, TransactionRowData } from '@/components/dashboard/TransactionRowNew';
import { TransactionTable } from '@/components/dashboard/TransactionTable';
import { AppShell, BottomNav, PageContainer, TopBar } from '@/components/layout';
import { EmptyState } from '@/components/shared';
import { TransactionSheet } from '@/components/transaction/TransactionSheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCategories } from '@/hooks/useCategories';
import { transactionKeys, useTransactionMutations, useTransactionsByMonth } from '@/hooks/useTransactions';
import { mapProfileToDb, transactionsService } from '@/services/transactionsService';
import { Transaction } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { addMonths, format, isToday, isYesterday, parseISO, startOfDay, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ChevronDown, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

function mapProfileFromDb(profile: string | null | undefined): 'Leonardo' | 'Flavia' | null {
    if (profile === 'Flávia' || profile === 'Flavia') return 'Flavia';
    if (profile === 'Leonardo') return 'Leonardo';
    return null;
}

function formatDateLabel(dateStr: string): string {
    try {
        const date = parseISO(dateStr);
        if (isToday(date)) return 'Hoje';
        if (isYesterday(date)) return 'Ontem';
        return format(date, "dd 'de' MMM", { locale: ptBR });
    } catch {
        return dateStr;
    }
}

// Componente para seção de atrasados com collapse
function OverdueSection({
    transactions,
    onTransactionClick,
}: {
    transactions: TransactionRowData[];
    onTransactionClick: (id: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div
            className="rounded-2xl border overflow-hidden"
            style={{
                backgroundColor: 'var(--accent-warning-bg)',
                borderColor: 'var(--accent-warning)',
            }}
        >
            {/* Header clicável */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" style={{ color: 'var(--accent-warning)' }} />
                    <span className="font-semibold" style={{ color: 'var(--accent-warning)' }}>
                        Atrasados ({transactions.length})
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-5 h-5" style={{ color: 'var(--accent-warning)' }} />
                </motion.div>
            </button>

            {/* Conteúdo colapsável */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-1">
                            {transactions.map((t) => (
                                <TransactionRow
                                    key={t.id}
                                    transaction={t}
                                    onClick={() => onTransactionClick(t.id)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function DashboardPage() {
    // Estado local da UI
    const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
    const [today, setToday] = useState<Date | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    // Sheet states
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetType, setSheetType] = useState<'income' | 'expense'>('expense');
    const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');

    // Responsividade
    const isMobile = useIsMobile();

    // Query Client para prefetch
    const queryClient = useQueryClient();

    // Definir data no cliente para evitar diferença servidor/cliente
    useEffect(() => {
        const now = new Date();
        setSelectedMonth(now);
        setToday(startOfDay(now));
    }, []);

    // Queries do TanStack Query
    const month = selectedMonth?.getMonth() ?? 0;
    const year = selectedMonth?.getFullYear() ?? 2024;

    const { data: transactions = [], isLoading } = useTransactionsByMonth(month, year);
    const { data: categories = [] } = useCategories();

    // Prefetch de meses adjacentes para navegação instantânea
    useEffect(() => {
        if (!selectedMonth) return;

        const currentMonth = selectedMonth.getMonth();
        const currentYear = selectedMonth.getFullYear();

        // Prefetch mês anterior
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        queryClient.prefetchQuery({
            queryKey: transactionKeys.byMonth(prevMonth, prevYear),
            queryFn: () => transactionsService.getByMonth(prevMonth, prevYear),
            staleTime: 1000 * 60 * 5, // 5 minutos
        });

        // Prefetch próximo mês
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        queryClient.prefetchQuery({
            queryKey: transactionKeys.byMonth(nextMonth, nextYear),
            queryFn: () => transactionsService.getByMonth(nextMonth, nextYear),
            staleTime: 1000 * 60 * 5,
        });
    }, [selectedMonth, queryClient]);

    // Mutations
    const { create, update, delete: deleteMutation, isLoading: isMutating } = useTransactionMutations();

    // Calcular totais
    const { income, expenses, balance, percentChange } = useMemo(() => {
        let inc = 0;
        let exp = 0;
        transactions.forEach((t) => {
            if (t.type === 'income') inc += t.amount;
            else exp += t.amount;
        });
        return {
            income: inc,
            expenses: exp,
            balance: inc - exp,
            percentChange: 0,
        };
    }, [transactions]);

    // Mapear transações para o formato do componente
    const mappedTransactions: TransactionRowData[] = useMemo(() => {
        return transactions.map((t) => ({
            id: t.id,
            description: t.description,
            amount: t.amount,
            type: t.type,
            category: categories.find((c) => c.id === t.category_id)?.name,
            responsibleName: t.profile || undefined,
            isPaid: t.status === 'paid',
            timestamp: t.date,
        }));
    }, [transactions, categories]);

    // Filtrar por categoria selecionada
    const filteredTransactions = useMemo(() => {
        if (!selectedCategoryId) return mappedTransactions;
        const category = categories.find((c) => c.id === selectedCategoryId);
        if (!category) return mappedTransactions;
        return mappedTransactions.filter((t) => t.category === category.name);
    }, [mappedTransactions, selectedCategoryId, categories]);

    // Agrupar por data
    const groupedTransactions = useMemo(() => {
        const sorted = [...filteredTransactions].sort((a, b) =>
            new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
        );

        const dateMap = new Map<string, TransactionRowData[]>();

        sorted.forEach((t) => {
            const dateKey = t.timestamp || 'Sem data';
            if (!dateMap.has(dateKey)) {
                dateMap.set(dateKey, []);
            }
            dateMap.get(dateKey)!.push(t);
        });

        const groups: { label: string; transactions: TransactionRowData[] }[] = [];
        dateMap.forEach((txns, dateKey) => {
            groups.push({
                label: formatDateLabel(dateKey),
                transactions: txns,
            });
        });

        return groups;
    }, [mappedTransactions]);

    // Transações atrasadas
    const overdueTransactions = useMemo(() => {
        if (!today) return [];
        return mappedTransactions.filter((t) => {
            if (t.isPaid || t.type === 'income') return false;
            const txDate = t.timestamp ? parseISO(t.timestamp) : null;
            return txDate && txDate < today;
        });
    }, [mappedTransactions, today]);

    // Handlers
    const openAddSheet = (type: 'income' | 'expense') => {
        setSheetType(type);
        setSheetMode('add');
        setEditingTransaction(null);
        setSheetOpen(true);
    };

    const openEditSheet = (transactionId: string) => {
        const tx = transactions.find((t) => t.id === transactionId);
        if (tx) {
            setEditingTransaction(tx);
            setSheetType(tx.type);
            setSheetMode('edit');
            setSheetOpen(true);
        }
    };

    const handleSaveTransaction = async (data: {
        description: string;
        amount: number;
        date: string;
        categoryId: string | null;
        paymentMethodId: string | null;
        profile: 'Leonardo' | 'Flavia' | null;
        isPaid: boolean;
    }) => {
        try {
            if (sheetMode === 'add') {
                await create.mutateAsync({
                    description: data.description,
                    amount: data.amount,
                    date: data.date,
                    type: sheetType,
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
        } catch (error) {
            toast.error('Erro ao salvar transação');
        }
    };

    const handlePreviousMonth = () => {
        if (selectedMonth) {
            setSelectedMonth(subMonths(selectedMonth, 1));
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth) {
            setSelectedMonth(addMonths(selectedMonth, 1));
        }
    };

    // Handler para marcar como pago via swipe
    const handleTogglePaid = async (id: string) => {
        const transaction = transactions.find((t) => t.id === id);
        if (!transaction) return;

        try {
            await update.mutateAsync({
                id,
                updates: {
                    status: transaction.status === 'paid' ? 'pending' : 'paid',
                },
            });
            toast.success(
                transaction.status === 'paid'
                    ? 'Transação marcada como pendente'
                    : 'Transação marcada como paga'
            );
        } catch {
            toast.error('Erro ao atualizar transação');
        }
    };

    // Handler para deletar via swipe
    const handleDeleteTransaction = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            toast.success('Transação removida');
        } catch {
            toast.error('Erro ao remover transação');
        }
    };

    // Loading state
    if (!selectedMonth || isLoading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--accent-lime)' }} />
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <TopBar title="Dashboard" />

            <PageContainer className="space-y-6">
                {/* === SEÇÃO HERO: Grid com BalanceCard + MiniStats === */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Balance Card - ocupa 2 colunas em desktop */}
                    <div className="md:col-span-2">
                        <BalanceCard
                            balance={balance}
                            income={income}
                            expenses={expenses}
                            selectedMonth={selectedMonth}
                            onPreviousMonth={handlePreviousMonth}
                            onNextMonth={handleNextMonth}
                        />
                    </div>

                    {/* Mini Stats - apenas desktop */}
                    <div className="hidden md:block">
                        <MiniStatsCard
                            income={income}
                            expenses={expenses}
                            percentChange={percentChange}
                        />
                    </div>
                </div>

                {/* === SEÇÃO AÇÕES: Quick Actions + Alerta Atrasados === */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Quick Actions - mais compacto em desktop */}
                    <QuickActions
                        onAddIncome={() => openAddSheet('income')}
                        onAddExpense={() => openAddSheet('expense')}
                        className="md:flex-shrink-0"
                    />

                    {/* Alerta de Atrasados - compacto */}
                    {overdueTransactions.length > 0 && (
                        <OverdueAlert
                            count={overdueTransactions.length}
                            totalAmount={overdueTransactions.reduce((acc, t) => acc + t.amount, 0)}
                            onClick={() => {
                                // Scroll para seção de atrasados ou abrir modal
                                if (overdueTransactions[0]) {
                                    openEditSheet(overdueTransactions[0].id);
                                }
                            }}
                            className="flex-1"
                        />
                    )}
                </div>

                {/* === Atrasados Expandido (apenas mobile) === */}
                {isMobile && overdueTransactions.length > 0 && (
                    <OverdueSection
                        transactions={overdueTransactions}
                        onTransactionClick={openEditSheet}
                    />
                )}

                {/* === SEÇÃO TRANSAÇÕES === */}
                <div className="space-y-4">
                    {/* Header com título e filtros */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Transações
                        </h2>

                        {/* Desktop: CategoryTabs inline */}
                        {!isMobile && (
                            <CategoryTabs
                                categories={categories}
                                selectedId={selectedCategoryId}
                                onSelect={setSelectedCategoryId}
                            />
                        )}

                        {/* Botão limpar filtro (se filtro ativo) */}
                        {selectedCategoryId && (
                            <button
                                onClick={() => setSelectedCategoryId(null)}
                                className="text-sm px-3 py-1.5 rounded-lg md:ml-2"
                                style={{
                                    color: 'var(--accent-lime)',
                                    backgroundColor: 'var(--accent-lime-bg)',
                                }}
                            >
                                Limpar filtro
                            </button>
                        )}
                    </div>

                    {/* Mobile: CategoryGrid com ícones grandes */}
                    {isMobile && (
                        <CategoryGrid
                            categories={categories}
                            selectedId={selectedCategoryId}
                            onSelect={setSelectedCategoryId}
                        />
                    )}

                    {/* Lista/Tabela de Transações */}
                    {groupedTransactions.length === 0 ? (
                        <EmptyState
                            type="transactions"
                            title={selectedCategoryId ? "Nenhuma transação nesta categoria" : "Nenhuma transação este mês"}
                            description={selectedCategoryId ? "Tente limpar o filtro ou adicionar uma nova transação" : "Toque no botão + para adicionar sua primeira transação"}
                            actionLabel="Adicionar"
                            onAction={() => openAddSheet('expense')}
                        />
                    ) : isMobile ? (
                        // Mobile: Lista agrupada por data com swipe gestures
                        groupedTransactions.map((group) => (
                            <TransactionGroup
                                key={group.label}
                                dateLabel={group.label}
                                transactions={group.transactions}
                                onTransactionClick={openEditSheet}
                                onTogglePaid={handleTogglePaid}
                                onDelete={handleDeleteTransaction}
                            />
                        ))
                    ) : (
                        // Desktop: Tabela com todas as transações
                        <TransactionTable
                            transactions={filteredTransactions.map(t => ({
                                ...t,
                                date: t.timestamp,
                            }))}
                            onEdit={openEditSheet}
                            onDelete={handleDeleteTransaction}
                            onTogglePaid={handleTogglePaid}
                        />
                    )}
                </div>
            </PageContainer>

            {/* Bottom Navigation - apenas mobile */}
            <BottomNav onAddClick={() => openAddSheet('expense')} />

            {/* Transaction Sheet */}
            <TransactionSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                type={sheetType}
                mode={sheetMode}
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
                onSave={handleSaveTransaction}
                isLoading={isMutating}
            />
        </AppShell>
    );
}
