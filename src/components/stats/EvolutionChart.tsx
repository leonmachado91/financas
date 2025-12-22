"use client";

import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface MonthData {
    month: string;
    value: number;
    label?: string;
}

interface EvolutionChartProps {
    data: MonthData[];
    /** Cor da área (padrão: lime) */
    color?: string;
    /** Altura do gráfico */
    height?: number;
    /** Classes adicionais */
    className?: string;
    /** Tipo de valor (receita ou despesa) */
    type?: 'income' | 'expense';
}

function formatCurrencyCompact(value: number): string {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toFixed(0);
}

function formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * EvolutionChart - Gráfico de área para evolução mensal
 * 
 * Mostra histórico de gastos/receitas ao longo dos meses.
 */
export function EvolutionChart({
    data,
    color,
    height = 200,
    className,
    type = 'expense',
}: EvolutionChartProps) {
    const chartColor = color || (type === 'income' ? 'var(--accent-success)' : 'var(--accent-lime)');

    const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substr(2, 9)}`, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="px-3 py-2 rounded-xl shadow-lg"
                    style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-medium)',
                    }}
                >
                    <p
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        {label}
                    </p>
                    <p
                        className="font-semibold"
                        style={{ color: chartColor }}
                    >
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <div
                className={cn("flex items-center justify-center", className)}
                style={{ height }}
            >
                <p style={{ color: 'var(--text-tertiary)' }}>
                    Sem dados para exibir
                </p>
            </div>
        );
    }

    return (
        <div className={cn("", className)} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="0%"
                                stopColor={chartColor}
                                stopOpacity={0.4}
                            />
                            <stop
                                offset="100%"
                                stopColor={chartColor}
                                stopOpacity={0.05}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border-subtle)"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                        dy={10}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                        tickFormatter={formatCurrencyCompact}
                        dx={-5}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={chartColor}
                        strokeWidth={2}
                        fill={`url(#${gradientId})`}
                        animationDuration={800}
                        dot={{
                            fill: chartColor,
                            strokeWidth: 0,
                            r: 3,
                        }}
                        activeDot={{
                            fill: chartColor,
                            stroke: 'var(--bg-primary)',
                            strokeWidth: 2,
                            r: 6,
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
