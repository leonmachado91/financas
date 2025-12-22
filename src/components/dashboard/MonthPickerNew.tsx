"use client";

import { cn } from '@/lib/utils';
import { addMonths, format, isSameMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

interface MonthPickerProps {
    /** Data atual selecionada */
    currentDate: Date;
    /** Callback quando mês muda */
    onMonthChange: (date: Date) => void;
    /** Classes adicionais */
    className?: string;
    /** Variante de exibição */
    variant?: 'carousel' | 'compact';
}

interface MonthItemProps {
    date: Date;
    isActive: boolean;
    onClick: () => void;
}

function MonthItem({ date, isActive, onClick }: MonthItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all shrink-0 snap-center",
                isActive
                    ? "border-2 scale-105"
                    : "border border-transparent opacity-50 hover:opacity-80"
            )}
            style={{
                minWidth: isActive ? '80px' : '60px',
                backgroundColor: isActive ? 'var(--accent-lime-glow)' : 'transparent',
                borderColor: isActive ? 'var(--accent-lime)' : 'transparent',
            }}
        >
            <span
                className={cn(
                    "font-bold uppercase",
                    isActive ? "text-lg" : "text-sm"
                )}
                style={{ color: isActive ? 'var(--accent-lime)' : 'var(--text-tertiary)' }}
            >
                {format(date, 'MMM', { locale: ptBR })}
            </span>
            {isActive && (
                <span
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    {format(date, 'yyyy')}
                </span>
            )}
        </button>
    );
}

/**
 * MonthPicker - Seletor de mês refinado
 * 
 * Duas variantes:
 * - carousel: Scroll horizontal de meses com snap
 * - compact: Header simples com setas de navegação
 */
export function MonthPicker({
    currentDate,
    onMonthChange,
    className,
    variant = 'carousel',
}: MonthPickerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Gerar 5 meses centrados na data atual
    const months = [
        subMonths(currentDate, 2),
        subMonths(currentDate, 1),
        currentDate,
        addMonths(currentDate, 1),
        addMonths(currentDate, 2),
    ];

    const handlePrev = useCallback(() => {
        onMonthChange(subMonths(currentDate, 1));
    }, [currentDate, onMonthChange]);

    const handleNext = useCallback(() => {
        onMonthChange(addMonths(currentDate, 1));
    }, [currentDate, onMonthChange]);

    // Scroll para centralizar o mês ativo
    useEffect(() => {
        if (scrollRef.current && variant === 'carousel') {
            const container = scrollRef.current;
            const activeItem = container.children[2] as HTMLElement;
            if (activeItem) {
                const scrollLeft = activeItem.offsetLeft - container.offsetWidth / 2 + activeItem.offsetWidth / 2;
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [currentDate, variant]);

    if (variant === 'compact') {
        return (
            <div className={cn("flex items-center justify-center gap-2", className)}>
                <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl transition-all hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span
                    className="min-w-[150px] text-center font-semibold capitalize"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </span>
                <button
                    onClick={handleNext}
                    className="p-2 rounded-xl transition-all hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className={cn("relative", className)}>
            <div className="flex items-center gap-2">
                {/* Seta Esquerda */}
                <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl shrink-0 transition-all hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Carrossel de Meses */}
                <div
                    ref={scrollRef}
                    className="flex-1 flex items-center gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide py-2"
                >
                    {months.map((date, index) => {
                        const isActive = isSameMonth(date, currentDate);
                        return (
                            <MonthItem
                                key={date.toISOString()}
                                date={date}
                                isActive={isActive}
                                onClick={() => !isActive && onMonthChange(date)}
                            />
                        );
                    })}
                </div>

                {/* Seta Direita */}
                <button
                    onClick={handleNext}
                    className="p-2 rounded-xl shrink-0 transition-all hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
