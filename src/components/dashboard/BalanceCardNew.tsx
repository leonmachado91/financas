"use client";

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface BalanceCardProps {
    /** Saldo total */
    balance: number;
    /** Total de receitas do período */
    income: number;
    /** Total de despesas do período */
    expenses: number;
    /** Mês selecionado */
    selectedMonth: Date;
    /** Callback para navegar ao mês anterior */
    onPreviousMonth?: () => void;
    /** Callback para navegar ao próximo mês */
    onNextMonth?: () => void;
    /** Classes adicionais */
    className?: string;
}

function formatCurrency(value: number): string {
    return `R$ ${Math.abs(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function formatCurrencyCompact(value: number): string {
    if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1)}k`;
    }
    return `R$ ${value.toFixed(0)}`;
}

/**
 * BalanceCard - Hero card com gradiente mostrando saldo principal
 * 
 * Inclui navegação de mês integrada no topo do card.
 */
export function BalanceCard({
    balance,
    income,
    expenses,
    selectedMonth,
    onPreviousMonth,
    onNextMonth,
    className,
}: BalanceCardProps) {
    const [showBalance, setShowBalance] = useState(true);
    const [direction, setDirection] = useState(0); // -1 = anterior, 1 = próximo
    const isPositive = balance >= 0;

    const handlePrevious = () => {
        setDirection(-1);
        onPreviousMonth?.();
    };

    const handleNext = () => {
        setDirection(1);
        onNextMonth?.();
    };

    // Formatar mês e ano
    const monthLabel = format(selectedMonth, 'MMMM', { locale: ptBR });
    const yearLabel = format(selectedMonth, 'yyyy');

    // Variantes de animação para transição de mês
    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -50 : 50,
            opacity: 0,
        }),
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl p-6",
                className
            )}
            style={{
                background: isPositive
                    ? 'var(--gradient-hero)'
                    : 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)'
            }}
        >
            {/* Decorative circles */}
            <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20"
                style={{ backgroundColor: 'white' }}
            />
            <div
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
                style={{ backgroundColor: 'white' }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Month Navigation Header */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={handlePrevious}
                        className="p-2 rounded-xl bg-black/10 hover:bg-black/20 active:scale-95 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-black/70" />
                    </button>

                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={`${selectedMonth.getMonth()}-${selectedMonth.getFullYear()}`}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="text-center"
                        >
                            <h2 className="text-lg font-bold text-black capitalize">
                                {monthLabel}
                            </h2>
                            <span className="text-sm text-black/60">{yearLabel}</span>
                        </motion.div>
                    </AnimatePresence>

                    <button
                        onClick={handleNext}
                        className="p-2 rounded-xl bg-black/10 hover:bg-black/20 active:scale-95 transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-black/70" />
                    </button>
                </div>

                {/* Saldo Total Label + Eye Button */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-black/60 text-sm font-medium">
                        Saldo Total
                    </span>
                    <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 transition-colors"
                    >
                        {showBalance ? (
                            <Eye className="w-4 h-4 text-black/60" />
                        ) : (
                            <EyeOff className="w-4 h-4 text-black/60" />
                        )}
                    </button>
                </div>

                {/* Main Balance */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.h1
                        key={balance}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight"
                    >
                        {showBalance ? (
                            <>
                                {!isPositive && '-'}
                                {formatCurrency(balance)}
                            </>
                        ) : (
                            'R$ •••••'
                        )}
                    </motion.h1>
                </AnimatePresence>

                {/* Income/Expense Row */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={`income-${income}-expense-${expenses}`}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.05 }}
                        className="flex items-center gap-6"
                    >
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-black/10">
                                <ArrowUp className="w-3 h-3 text-black/70" />
                            </div>
                            <span className="text-black/80 text-sm font-medium">
                                {showBalance ? formatCurrencyCompact(income) : '•••'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-black/10">
                                <ArrowDown className="w-3 h-3 text-black/70" />
                            </div>
                            <span className="text-black/80 text-sm font-medium">
                                {showBalance ? formatCurrencyCompact(expenses) : '•••'}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Logo/Brand mark */}
            <div className="absolute bottom-4 right-4 opacity-20">
                <span className="text-black text-2xl font-black">F</span>
            </div>
        </div>
    );
}
