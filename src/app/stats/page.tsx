"use client";

import { AppShell, BottomNav, PageContainer, TopBar } from '@/components/layout';
import { CategoryDonut, CategoryLegend, EvolutionChart } from '@/components/stats';
import { useCategories } from '@/hooks/useCategories';
import { useTransactionsByMonth } from '@/hooks/useTransactions';
import { cn } from '@/lib/utils';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowUp, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
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
                {/* Header com período */}
                <div className="text-center space-y-3">
                    <h1
                        className="text-2xl font-bold capitalize"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {periodType === 'month'
                            ? format(selectedDate, 'MMMM yyyy', { locale: ptBR })
                            : format(selectedDate, 'yyyy', { locale: ptBR })
                        }
                    </h1>

                    {/* Toggle Mês/Ano */}
                    <div
                        className="inline-flex p-1 rounded-lg"
                        style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                        <button
                            onClick={() => setPeriodType('month')}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                periodType === 'month'
                                    ? "shadow-sm"
                                    : "opacity-60"
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
                                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                periodType === 'year'
                                    ? "shadow-sm"
                                    : "opacity-60"
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

                {/* Toggle Despesas/Receitas */}
                <div
                    className="flex p-1 rounded-xl"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                    <button
                        onClick={() => setViewType('expenses')}
                        className={cn(
                            "flex-1 py-2.5 rounded-lg font-medium transition-all",
                            viewType === 'expenses'
                                ? "shadow-sm"
                                : "opacity-60"
                        )}
                        style={{
                            backgroundColor: viewType === 'expenses' ? 'var(--accent-danger-bg)' : 'transparent',
                            color: viewType === 'expenses' ? 'var(--accent-danger)' : 'var(--text-tertiary)',
                        }}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <ArrowDown className="w-4 h-4" />
                            Despesas
                        </div>
                    </button>
                    <button
                        onClick={() => setViewType('income')}
                        className={cn(
                            "flex-1 py-2.5 rounded-lg font-medium transition-all",
                            viewType === 'income'
                                ? "shadow-sm"
                                : "opacity-60"
                        )}
                        style={{
                            backgroundColor: viewType === 'income' ? 'var(--accent-success-bg)' : 'transparent',
                            color: viewType === 'income' ? 'var(--accent-success)' : 'var(--text-tertiary)',
                        }}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <ArrowUp className="w-4 h-4" />
                            Receitas
                        </div>
                    </button>
                </div>

                {/* Card de Resumo */}
                <div
                    className="p-5 rounded-2xl"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p
                                className="text-sm"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                {viewType === 'expenses' ? 'Total de Despesas' : 'Total de Receitas'}
                            </p>
                            <p
                                className="text-3xl font-bold mt-1"
                                style={{
                                    color: viewType === 'expenses'
                                        ? 'var(--accent-danger)'
                                        : 'var(--accent-success)',
                                }}
                            >
                                {formatCurrency(currentTotal)}
                            </p>
                        </div>
                        <div
                            className="p-3 rounded-xl"
                            style={{
                                backgroundColor: viewType === 'expenses'
                                    ? 'var(--accent-danger-bg)'
                                    : 'var(--accent-success-bg)',
                            }}
                        >
                            {viewType === 'expenses' ? (
                                <TrendingDown
                                    className="w-6 h-6"
                                    style={{ color: 'var(--accent-danger)' }}
                                />
                            ) : (
                                <TrendingUp
                                    className="w-6 h-6"
                                    style={{ color: 'var(--accent-success)' }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Saldo */}
                    <div
                        className="mt-4 pt-4 border-t flex items-center justify-between"
                        style={{ borderColor: 'var(--border-subtle)' }}
                    >
                        <span style={{ color: 'var(--text-tertiary)' }}>
                            Saldo do mês
                        </span>
                        <span
                            className="font-semibold"
                            style={{
                                color: balance >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)',
                            }}
                        >
                            {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                        </span>
                    </div>

                    {/* Comparação com período anterior */}
                    <div
                        className="mt-3 pt-3 border-t flex items-center justify-between"
                        style={{ borderColor: 'var(--border-subtle)' }}
                    >
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            vs. {periodType === 'month' ? 'mês anterior' : 'ano anterior'}
                        </span>
                        {(() => {
                            // Mock: simulando variação (em produção, buscar dados reais)
                            const previousTotal = currentTotal * (0.8 + Math.random() * 0.4);
                            const variation = ((currentTotal - previousTotal) / previousTotal) * 100;
                            const isNegative = variation < 0;
                            const isExpense = viewType === 'expenses';
                            // Para despesas: variação negativa é bom (gastou menos)
                            // Para receitas: variação positiva é bom (ganhou mais)
                            const isGood = isExpense ? isNegative : !isNegative;

                            return (
                                <span
                                    className="text-sm font-medium px-2 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: isGood ? 'var(--accent-success-bg)' : 'var(--accent-danger-bg)',
                                        color: isGood ? 'var(--accent-success)' : 'var(--accent-danger)',
                                    }}
                                >
                                    {isNegative ? '' : '+'}{variation.toFixed(1)}%
                                </span>
                            );
                        })()}
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
        </AppShell>
    );
}
