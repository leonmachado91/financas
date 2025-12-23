"use client";

import { cn } from '@/lib/utils';
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface MiniStatsCardProps {
    /** Total de receitas do mês */
    income: number;
    /** Total de despesas do mês */
    expenses: number;
    /** Variação percentual vs mês anterior (opcional) */
    percentChange?: number;
    /** Classes adicionais */
    className?: string;
}

function formatCurrency(value: number): string {
    if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1)}k`;
    }
    return `R$ ${value.toFixed(0)}`;
}

/**
 * MiniStatsCard - Card compacto de resumo financeiro
 * 
 * Exibe receitas, despesas e variação em formato compacto
 * para uso no grid do dashboard desktop.
 */
export function MiniStatsCard({
    income,
    expenses,
    percentChange,
    className,
}: MiniStatsCardProps) {
    const balance = income - expenses;
    const isPositive = balance >= 0;
    const hasChange = percentChange !== undefined && percentChange !== 0;

    return (
        <div
            className={cn(
                "p-5 rounded-2xl h-full flex flex-col",
                className
            )}
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    Resumo do Mês
                </h3>
                <Link
                    href="/stats"
                    className="flex items-center gap-1 text-xs font-medium hover:underline"
                    style={{ color: 'var(--accent-lime)' }}
                >
                    Ver mais
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="space-y-3 flex-1">
                {/* Receitas */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: 'var(--accent-success)' }}
                        />
                        <span
                            className="text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Receitas
                        </span>
                    </div>
                    <span
                        className="font-semibold"
                        style={{ color: 'var(--accent-success)' }}
                    >
                        {formatCurrency(income)}
                    </span>
                </div>

                {/* Despesas */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: 'var(--accent-danger)' }}
                        />
                        <span
                            className="text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Despesas
                        </span>
                    </div>
                    <span
                        className="font-semibold"
                        style={{ color: 'var(--accent-danger)' }}
                    >
                        {formatCurrency(expenses)}
                    </span>
                </div>

                {/* Divider */}
                <div
                    className="border-t"
                    style={{ borderColor: 'var(--border-subtle)' }}
                />

                {/* Saldo */}
                <div className="flex items-center justify-between">
                    <span
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Saldo
                    </span>
                    <span
                        className="font-bold text-lg"
                        style={{ color: isPositive ? 'var(--accent-success)' : 'var(--accent-danger)' }}
                    >
                        {isPositive ? '+' : ''}{formatCurrency(balance)}
                    </span>
                </div>
            </div>

            {/* Variação (se disponível) */}
            {hasChange && (
                <div
                    className="mt-4 pt-3 border-t flex items-center justify-between"
                    style={{ borderColor: 'var(--border-subtle)' }}
                >
                    <span
                        className="text-xs"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        vs. mês anterior
                    </span>
                    <div
                        className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: percentChange! >= 0
                                ? 'var(--accent-success-bg)'
                                : 'var(--accent-danger-bg)',
                            color: percentChange! >= 0
                                ? 'var(--accent-success)'
                                : 'var(--accent-danger)',
                        }}
                    >
                        {percentChange! >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        {percentChange! >= 0 ? '+' : ''}{percentChange}%
                    </div>
                </div>
            )}
        </div>
    );
}
