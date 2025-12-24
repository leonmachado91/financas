"use client";

import { BalanceCard } from '@/components/dashboard/BalanceCardNew';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { CategoryTabs } from '@/components/dashboard/CategoryTabs';
import { MiniStatsCard } from '@/components/dashboard/MiniStatsCard';
import { SplitTransactionView } from '@/components/dashboard/SplitTransactionView';
import { TransactionGroup, TransactionRowData } from '@/components/dashboard/TransactionRowNew';
import { AppShell, BottomNav, PageContainer, TopBar } from '@/components/layout';
import { EmptyState } from '@/components/shared';
import { TransactionList } from '@/components/shared/TransactionList';
import { GlobalTransactionSheet } from '@/components/transaction/GlobalTransactionSheet';
import { FilterPill, FilterPillGroup } from '@/components/ui/filter-pill';
import { useTransactionSheet } from '@/contexts/TransactionSheetContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCategories } from '@/hooks/useCategories';
import { transactionKeys, useTransactionMutations, useTransactionsByMonth } from '@/hooks/useTransactions';
import { transactionsService } from '@/services/transactionsService';
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

// Lista unificada de transações atrasadas (cor amarela)
function OverdueSection({
    expenseTransactions,
    incomeTransactions,
    onTransactionClick,
}: {
    expenseTransactions: TransactionRowData[];
    incomeTransactions: TransactionRowData[];
    onTransactionClick: (id: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(true);
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    // Combinar todas as transações atrasadas
    const allOverdue = [...expenseTransactions, ...incomeTransactions];

    // Filtrar conforme seleção
    const filteredTransactions = filter === 'all'
        ? allOverdue
        : filter === 'income'
            ? incomeTransactions
            : expenseTransactions;

    if (allOverdue.length === 0) return null;

    return (
        <div
            className="rounded-2xl border overflow-hidden"
            style={{
                backgroundColor: 'var(--accent-warning-bg)',
                borderColor: 'var(--accent-warning)',
            }}
        >
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" style={{ color: 'var(--accent-warning)' }} />
                    <span className="font-semibold" style={{ color: 'var(--accent-warning)' }}>
                        Atrasados ({allOverdue.length})
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
                        {/* Filtros usando FilterPill padronizado */}
                        <div className="px-4 pb-2">
                            <FilterPillGroup>
                                <FilterPill
                                    variant="warning"
                                    selected={filter === 'all'}
                                    onClick={() => setFilter('all')}
                                    count={allOverdue.length}
                                    size="sm"
                                >
                                    Todos
                                </FilterPill>
                                <FilterPill
                                    variant="danger"
                                    selected={filter === 'expense'}
                                    onClick={() => setFilter('expense')}
                                    count={expenseTransactions.length}
                                    size="sm"
                                >
                                    A Pagar
                                </FilterPill>
                                <FilterPill
                                    variant="success"
                                    selected={filter === 'income'}
                                    onClick={() => setFilter('income')}
                                    count={incomeTransactions.length}
                                    size="sm"
                                >
                                    A Receber
                                </FilterPill>
                            </FilterPillGroup>
                        </div>

                        {/* Lista usando TransactionList padronizado */}
                        <div className="px-4 pb-4">
                            <TransactionList
                                transactions={filteredTransactions}
                                onItemClick={onTransactionClick}
                                itemProps={{
                                    showCheckbox: false,
                                    showIcon: true,
                                    showDate: true,
                                    showResponsible: true,
                                    showMenu: false,
                                    compact: true,
                                }}
                            />
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
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    // Contexto do TransactionSheet
    const { openAddSheet, openEditSheet } = useTransactionSheet();

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
    const { update, delete: deleteMutation } = useTransactionMutations();

    // Calcular totais (real = pagas, estimado = todas)
    const { realIncome, realExpenses, realBalance, estimatedBalance, percentChange } = useMemo(() => {
        let realInc = 0;
        let realExp = 0;
        let estimatedInc = 0;
        let estimatedExp = 0;

        transactions.forEach((t) => {
            const isPaid = t.status === 'paid';
            if (t.type === 'income') {
                estimatedInc += t.amount;
                if (isPaid) realInc += t.amount;
            } else {
                estimatedExp += t.amount;
                if (isPaid) realExp += t.amount;
            }
        });

        return {
            realIncome: realInc,
            realExpenses: realExp,
            realBalance: realInc - realExp,
            estimatedBalance: estimatedInc - estimatedExp,
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

    // Transações atrasadas separadas por tipo
    const { overdueExpenses, overdueIncome, overdueTransactions } = useMemo(() => {
        if (!today) return { overdueExpenses: [], overdueIncome: [], overdueTransactions: [] };

        const allOverdue = mappedTransactions.filter((t) => {
            if (t.isPaid) return false;
            const txDate = t.timestamp ? parseISO(t.timestamp) : null;
            return txDate && txDate < today;
        });

        return {
            overdueExpenses: allOverdue.filter((t) => t.type === 'expense'),
            overdueIncome: allOverdue.filter((t) => t.type === 'income'),
            overdueTransactions: allOverdue,
        };
    }, [mappedTransactions, today]);

    // Handler para editar transação
    const handleEditTransaction = (transactionId: string) => {
        const tx = transactions.find((t) => t.id === transactionId);
        if (tx) {
            openEditSheet(tx);
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
                            realBalance={realBalance}
                            estimatedBalance={estimatedBalance}
                            realIncome={realIncome}
                            realExpenses={realExpenses}
                            selectedMonth={selectedMonth}
                            onPreviousMonth={handlePreviousMonth}
                            onNextMonth={handleNextMonth}
                        />
                    </div>

                    {/* Mini Stats - apenas desktop */}
                    <div className="hidden md:block">
                        <MiniStatsCard
                            income={realIncome}
                            expenses={realExpenses}
                            percentChange={percentChange}
                        />
                    </div>
                </div>


                {/* === Atrasados === */}
                {(overdueExpenses.length > 0 || overdueIncome.length > 0) && (
                    <OverdueSection
                        expenseTransactions={overdueExpenses}
                        incomeTransactions={overdueIncome}
                        onTransactionClick={handleEditTransaction}
                    />
                )}

                {/* === SEÇÃO TRANSAÇÕES === */}
                <div className="space-y-4">
                    {/* Header com título e filtros */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Transações
                        </h2>

                        {/* Desktop: CategoryTabs sempre à direita */}
                        {!isMobile && (
                            <div className="flex items-center gap-2 ml-auto">
                                <CategoryTabs
                                    categories={categories}
                                    selectedId={selectedCategoryId}
                                    onSelect={setSelectedCategoryId}
                                />

                                {/* Botão limpar filtro (se filtro ativo) */}
                                {selectedCategoryId && (
                                    <button
                                        onClick={() => setSelectedCategoryId(null)}
                                        className="text-sm px-3 py-1.5 rounded-lg shrink-0"
                                        style={{
                                            color: 'var(--accent-lime)',
                                            backgroundColor: 'var(--accent-lime-bg)',
                                        }}
                                    >
                                        Limpar
                                    </button>
                                )}
                            </div>
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
                                onTransactionClick={handleEditTransaction}
                                onTogglePaid={handleTogglePaid}
                                onDelete={handleDeleteTransaction}
                            />
                        ))
                    ) : (
                        // Desktop: Split-View com Receitas à esquerda e Despesas à direita
                        <SplitTransactionView
                            transactions={filteredTransactions.map(t => ({
                                ...t,
                                date: t.timestamp,
                            }))}
                            onEdit={handleEditTransaction}
                            onDelete={handleDeleteTransaction}
                            onTogglePaid={handleTogglePaid}
                            onAddIncome={() => openAddSheet('income')}
                            onAddExpense={() => openAddSheet('expense')}
                        />
                    )}
                </div>
            </PageContainer>

            {/* Bottom Navigation com FAB */}
            <BottomNav />

            {/* Transaction Sheet Global */}
            <GlobalTransactionSheet />
        </AppShell>
    );
}

