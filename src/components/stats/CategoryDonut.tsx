"use client";

import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryData {
    name: string;
    value: number;
    color: string;
    percentage?: number;
}

interface CategoryDonutProps {
    data: CategoryData[];
    /** Valor total para exibir no centro */
    totalValue?: number;
    /** Label do centro (ex: "Total") */
    centerLabel?: string;
    /** Altura do gráfico */
    height?: number;
    /** Classes adicionais */
    className?: string;
}

// Cores vibrantes para categorias
const defaultColors = [
    'var(--cat-orange)',
    'var(--cat-cyan)',
    'var(--cat-purple)',
    'var(--cat-pink)',
    'var(--cat-yellow)',
    'var(--cat-teal)',
    'var(--cat-indigo)',
    'var(--cat-blue)',
];

function formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
}

/**
 * CategoryDonut - Gráfico de rosca para categorias
 * 
 * Mostra distribuição de gastos/receitas por categoria com
 * valor total no centro.
 */
export function CategoryDonut({
    data,
    totalValue,
    centerLabel = "Total",
    height = 280,
    className,
}: CategoryDonutProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Adicionar cores e percentuais aos dados
    const chartData = useMemo(() => {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        return data.map((item, index) => ({
            ...item,
            color: item.color || defaultColors[index % defaultColors.length],
            percentage: total > 0 ? (item.value / total) * 100 : 0,
        }));
    }, [data]);

    const total = totalValue ?? data.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload as CategoryData & { percentage: number };
            return (
                <div
                    className="px-3 py-2 rounded-xl shadow-lg"
                    style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-medium)',
                    }}
                >
                    <p className="font-medium" style={{ color: item.color }}>
                        {item.name}
                    </p>
                    <p style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(item.value)}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {formatPercentage(item.percentage)}
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
        <div className={cn("relative", className)} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="85%"
                        paddingAngle={2}
                        dataKey="value"
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        animationBegin={0}
                        animationDuration={800}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                                style={{ transition: 'opacity 0.2s' }}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Centro do donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    {centerLabel}
                </span>
                <span
                    className="text-2xl font-bold"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {formatCurrency(total)}
                </span>
            </div>
        </div>
    );
}

/**
 * CategoryLegend - Legenda interativa para o donut
 */
interface CategoryLegendProps {
    data: CategoryData[];
    /** Callback ao clicar em item */
    onItemClick?: (category: string) => void;
    /** Classes adicionais */
    className?: string;
}

export function CategoryLegend({
    data,
    onItemClick,
    className,
}: CategoryLegendProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Ordenar por valor decrescente
    const sortedData = useMemo(() => {
        return [...data]
            .map((item, index) => ({
                ...item,
                color: item.color || defaultColors[index % defaultColors.length],
                percentage: total > 0 ? (item.value / total) * 100 : 0,
            }))
            .sort((a, b) => b.value - a.value);
    }, [data, total]);

    if (data.length === 0) {
        return null;
    }

    return (
        <div className={cn("space-y-2", className)}>
            {sortedData.map((item) => (
                <button
                    key={item.name}
                    onClick={() => onItemClick?.(item.name)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-[var(--bg-hover)]"
                >
                    {/* Cor */}
                    <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                    />

                    {/* Nome */}
                    <span
                        className="flex-1 text-left font-medium truncate"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {item.name}
                    </span>

                    {/* Percentual */}
                    <span
                        className="text-sm shrink-0"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        {formatPercentage(item.percentage!)}
                    </span>

                    {/* Valor */}
                    <span
                        className="font-semibold shrink-0 min-w-[100px] text-right"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {formatCurrency(item.value)}
                    </span>
                </button>
            ))}
        </div>
    );
}
