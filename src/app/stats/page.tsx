"use client";

import { AppShell, BottomNav, PageContainer, TopBar } from '@/components/layout';
import { CategoryDonut, CategoryLegend, EvolutionChart } from '@/components/stats';
import { GlobalTransactionSheet } from '@/components/transaction/GlobalTransactionSheet';
import { useCategories } from '@/hooks/useCategories';
import { useTransactionsByMonth } from '@/hooks/useTransactions';
import { cn } from '@/lib/utils';
import { addMonths, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ViewType = 'expenses' | 'income';
type PeriodType = 'month' | 'year';

function formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export default function StatsPage() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [viewType, setViewType] = useState<ViewType>('expenses');
    const [periodType, setPeriodType] = useState<PeriodType>('month');

    // Definir data no cliente
    useEffect(() => {
        setSelectedDate(new Date());
    }, []);

    const month = selectedDate?.getMonth() ?? 0;
    const year = selectedDate?.getFullYear() ?? 2024;

    // Buscar dados
    const { data: transactions = [], isLoading } = useTransactionsByMonth(month, year);
    const { data: categories = [] } = useCategories();

    // Filtrar por tipo
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t =>
            viewType === 'expenses' ? t.type === 'expense' : t.type === 'income'
        );
    }, [transactions, viewType]);

    // Calcular totais
    const { totalExpenses, totalIncome, balance } = useMemo(() => {
        return transactions.reduce(
            (acc, t) => {
                if (t.type === 'income') {
                    acc.totalIncome += t.amount;
                } else {
                    acc.totalExpenses += t.amount;
                }
                acc.balance = acc.totalIncome - acc.totalExpenses;
                return acc;
            },
            { totalExpenses: 0, totalIncome: 0, balance: 0 }
        );
    }, [transactions]);

    // Agrupar por categoria
    const categoryData = useMemo(() => {
        const grouped: Record<string, { name: string; value: number; color: string }> = {};

        filteredTransactions.forEach(t => {
            const category = categories.find(c => c.id === t.category_id);
            const name = category?.name || 'Outros';

            if (!grouped[name]) {
                grouped[name] = {
                    name,
                    value: 0,
                    color: '', // Será definido pelo componente
                };
            }
            grouped[name].value += t.amount;
        });

        return Object.values(grouped).sort((a, b) => b.value - a.value);
    }, [filteredTransactions, categories]);

    // Dados de evolução (mock dos últimos 6 meses)
    const evolutionData = useMemo((): { month: string; value: number }[] => {
        if (!selectedDate) return [];

        const months: { month: string; value: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(selectedDate, i);
            const monthLabel = format(date, 'MMM', { locale: ptBR }).toUpperCase();

            // TODO: buscar dados reais de cada mês
            // Por enquanto, usar valor do mês atual se for o mês selecionado
            const isCurrent = i === 0;
            const value = isCurrent
                ? (viewType === 'expenses' ? totalExpenses : totalIncome)
                : Math.random() * (viewType === 'expenses' ? totalExpenses : totalIncome) * 0.8 + 200;

            months.push({
                month: monthLabel,
                value: Math.round(value),
            });
        }
        return months;
    }, [selectedDate, viewType, totalExpenses, totalIncome]);

    const currentTotal = viewType === 'expenses' ? totalExpenses : totalIncome;

    // Handlers de navegação de mês
    const handlePreviousMonth = () => {
        if (selectedDate) {
            setSelectedDate(subMonths(selectedDate, 1));
        }
    };

    const handleNextMonth = () => {
        if (selectedDate) {
            setSelectedDate(addMonths(selectedDate, 1));
        }
    };

    // Loading state
    if (!selectedDate || isLoading) {
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
            <TopBar title="Estatísticas" />

            <PageContainer className="space-y-6">
                {/* === HEADER: Período e Toggle === */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Título e navegação de período */}
                    <div className="flex items-center gap-2">
                        {/* Botão mês anterior */}
                        <button
                            onClick={handlePreviousMonth}
                            className="p-2 rounded-lg transition-colors hover:opacity-80"
                            style={{ backgroundColor: 'var(--bg-tertiary)' }}
                            aria-label="Mês anterior"
                        >
                            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                        </button>

                        <h1
                            className="text-2xl font-bold capitalize min-w-[180px] text-center"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {periodType === 'month'
                                ? format(selectedDate, 'MMMM yyyy', { locale: ptBR })
                                : format(selectedDate, 'yyyy', { locale: ptBR })
                            }
                        </h1>

                        {/* Botão próximo mês */}
                        <button
                            onClick={handleNextMonth}
                            className="p-2 rounded-lg transition-colors hover:opacity-80"
                            style={{ backgroundColor: 'var(--bg-tertiary)' }}
                            aria-label="Próximo mês"
                        >
                            <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                        </button>

                        {/* Toggle Mês/Ano - inline */}
                        <div
                            className="inline-flex p-1 rounded-lg"
                            style={{ backgroundColor: 'var(--bg-tertiary)' }}
                        >
                            <button
                                onClick={() => setPeriodType('month')}
                                className={cn(
                                    "px-3 py-1 rounded-md text-sm font-medium transition-all",
                                    periodType === 'month' ? "shadow-sm" : "opacity-60"
                                )}
                                style={{
                                    backgroundColor: periodType === 'month' ? 'var(--bg-secondary)' : 'transparent',
                                    color: periodType === 'month' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                                }}
                            >
                                Mês
                            </button>
                            <button
                                onClick={() => setPeriodType('year')}
                                className={cn(
                                    "px-3 py-1 rounded-md text-sm font-medium transition-all",
                                    periodType === 'year' ? "shadow-sm" : "opacity-60"
                                )}
                                style={{
                                    backgroundColor: periodType === 'year' ? 'var(--bg-secondary)' : 'transparent',
                                    color: periodType === 'year' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                                }}
                            >
                                Ano
                            </button>
                        </div>
                    </div>

                    {/* Toggle Despesas/Receitas - compacto */}
                    <div
                        className="inline-flex p-1 rounded-xl self-start md:self-auto"
                        style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                        <button
                            onClick={() => setViewType('expenses')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                                viewType === 'expenses' ? "shadow-sm" : "opacity-60"
                            )}
                            style={{
                                backgroundColor: viewType === 'expenses' ? 'var(--accent-danger-bg)' : 'transparent',
                                color: viewType === 'expenses' ? 'var(--accent-danger)' : 'var(--text-tertiary)',
                            }}
                        >
                            <ArrowDown className="w-4 h-4" />
                            Despesas
                        </button>
                        <button
                            onClick={() => setViewType('income')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                                viewType === 'income' ? "shadow-sm" : "opacity-60"
                            )}
                            style={{
                                backgroundColor: viewType === 'income' ? 'var(--accent-success-bg)' : 'transparent',
                                color: viewType === 'income' ? 'var(--accent-success)' : 'var(--text-tertiary)',
                            }}
                        >
                            <ArrowUp className="w-4 h-4" />
                            Receitas
                        </button>
                    </div>
                </div>

                {/* === CARDS DE RESUMO EM GRID === */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card Despesas */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                    Total Despesas
                                </p>
                                <p
                                    className="text-2xl font-bold mt-1"
                                    style={{ color: 'var(--accent-danger)' }}
                                >
                                    {formatCurrency(totalExpenses)}
                                </p>
                            </div>
                            <div
                                className="p-3 rounded-xl"
                                style={{ backgroundColor: 'var(--accent-danger-bg)' }}
                            >
                                <TrendingDown className="w-5 h-5" style={{ color: 'var(--accent-danger)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Card Receitas */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                    Total Receitas
                                </p>
                                <p
                                    className="text-2xl font-bold mt-1"
                                    style={{ color: 'var(--accent-success)' }}
                                >
                                    {formatCurrency(totalIncome)}
                                </p>
                            </div>
                            <div
                                className="p-3 rounded-xl"
                                style={{ backgroundColor: 'var(--accent-success-bg)' }}
                            >
                                <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-success)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Card Saldo */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                    Saldo do Período
                                </p>
                                <p
                                    className="text-2xl font-bold mt-1"
                                    style={{ color: balance >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}
                                >
                                    {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                                </p>
                            </div>
                            <div
                                className="p-3 rounded-xl"
                                style={{
                                    backgroundColor: balance >= 0 ? 'var(--accent-success-bg)' : 'var(--accent-danger-bg)',
                                }}
                            >
                                {balance >= 0 ? (
                                    <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-success)' }} />
                                ) : (
                                    <TrendingDown className="w-5 h-5" style={{ color: 'var(--accent-danger)' }} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid responsivo para gráficos - 2 colunas em desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gráfico Donut */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                        <h3
                            className="font-semibold mb-4"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Por Categoria
                        </h3>

                        <CategoryDonut
                            data={categoryData}
                            totalValue={currentTotal}
                            centerLabel={viewType === 'expenses' ? 'Despesas' : 'Receitas'}
                        />

                        <CategoryLegend
                            data={categoryData}
                            className="mt-4"
                        />
                    </div>

                    {/* Gráfico de Evolução */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                        <h3
                            className="font-semibold mb-4"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Evolução (6 meses)
                        </h3>

                        <EvolutionChart
                            data={evolutionData}
                            type={viewType === 'expenses' ? 'expense' : 'income'}
                        />
                    </div>
                </div>
            </PageContainer>

            <BottomNav />

            <GlobalTransactionSheet />
        </AppShell>
    );
}
