"use client";

import { cn } from '@/lib/utils';
import { addMonths, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

interface MonthData {
    income: number;
    expenses: number;
    balance: number;
}

interface MonthSelectorProps {
    currentDate: Date;
    onMonthChange: (date: Date) => void;
    /** Dados do mês selecionado (central) */
    monthData?: MonthData;
}

function formatCurrency(value: number): string {
    return `R$ ${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatCurrencyCompact(value: number): string {
    if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1)}k`;
    }
    return `R$ ${value.toFixed(0)}`;
}

export function MonthSelector({ currentDate, onMonthChange, monthData }: MonthSelectorProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Generate 5 months centered on currentDate
    const months = [
        subMonths(currentDate, 2),
        subMonths(currentDate, 1),
        currentDate,
        addMonths(currentDate, 1),
        addMonths(currentDate, 2),
    ];

    const handlePrev = () => {
        onMonthChange(subMonths(currentDate, 1));
    };

    const handleNext = () => {
        onMonthChange(addMonths(currentDate, 1));
    };

    // Scroll para o item central quando o mês mudar (mobile)
    const scrollToCenter = useCallback(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const centerItem = container.children[2] as HTMLElement;
            if (centerItem) {
                const scrollLeft = centerItem.offsetLeft - container.offsetWidth / 2 + centerItem.offsetWidth / 2;
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, []);

    useEffect(() => {
        scrollToCenter();
    }, [currentDate, scrollToCenter]);

    const balance = monthData?.balance ?? 0;
    const isPositive = balance >= 0;

    return (
        <div className="relative w-full flex items-center justify-between py-4 md:py-8 p-[0px]">
            {/* Setas de navegação - maiores em desktop */}
            <button
                onClick={handlePrev}
                className="p-1 md:p-2 text-gray-400 hover:text-white transition-colors shrink-0"
            >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Container com scroll horizontal em mobile, flex center em desktop */}
            <div
                ref={scrollContainerRef}
                className="flex-1 flex items-center gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scroll-smooth md:justify-center px-2 md:px-0 py-6 md:py-[45px] scrollbar-hide"
            >
                {months.map((date, index) => {
                    // The center item (index 2) is always the active one
                    const isActive = index === 2;

                    return (
                        <div
                            key={date.toISOString()}
                            className={cn(
                                "transition-all duration-300 ease-out rounded-2xl p-4 md:p-6 flex flex-col items-center cursor-pointer shrink-0 snap-center",
                                // Tamanho responsivo
                                "min-w-[140px] md:min-w-[200px]",
                                isActive
                                    ? isPositive
                                        ? "bg-[#1A2C21] border border-green-500/20 scale-105 md:scale-110 z-10 shadow-[0_0_30px_rgba(74,222,128,0.1)]"
                                        : "bg-[#2C1A1A] border border-red-500/20 scale-105 md:scale-110 z-10 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                                    : "bg-transparent opacity-40 scale-95 md:scale-90 grayscale blur-[1px] hover:opacity-60"
                            )}
                            onClick={() => !isActive && onMonthChange(date)}
                        >
                            <div className={cn(
                                "mb-2 rounded-full p-1",
                                isActive
                                    ? (isPositive ? "bg-green-500 text-black" : "bg-red-500 text-white")
                                    : "bg-transparent text-gray-500"
                            )}>
                                {isActive && monthData ? (
                                    isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                                ) : (
                                    index % 2 === 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                                )}
                            </div>

                            <h3 className={cn(
                                "font-black text-gray-200 mb-2 md:mb-3 uppercase",
                                isActive ? "text-2xl md:text-4xl" : "text-lg md:text-2xl"
                            )}>{format(date, 'MMM', { locale: ptBR })}</h3>

                            {/* Resumo de Receitas e Despesas - apenas no card ativo */}
                            {isActive && monthData ? (
                                <>
                                    <div className="flex gap-2 md:gap-3 text-[10px] md:text-xs font-medium mb-1 md:mb-2">
                                        <span className="text-green-400">
                                            ↑ {formatCurrencyCompact(monthData.income)}
                                        </span>
                                        <span className="text-red-400">
                                            ↓ {formatCurrencyCompact(monthData.expenses)}
                                        </span>
                                    </div>

                                    <div className={cn(
                                        "font-black tracking-tight text-lg md:text-2xl",
                                        isPositive ? "text-green-500" : "text-red-500"
                                    )}>
                                        {isPositive ? '+' : '-'}{formatCurrency(balance)}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-3 text-xs font-medium mb-2 opacity-50">
                                        <span className="text-gray-500">---</span>
                                    </div>
                                    <div className="font-black tracking-tight text-lg md:text-xl text-gray-600">
                                        ---
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={handleNext}
                className="p-1 md:p-2 text-gray-400 hover:text-white transition-colors shrink-0"
            >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
        </div>
    );
}
