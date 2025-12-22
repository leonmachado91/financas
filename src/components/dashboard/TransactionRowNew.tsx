"use client";

import { SwipeableRow } from '@/components/shared/SwipeableRow';
import { cn } from '@/lib/utils';
import {
    Banknote, Car, Check, CreditCard, Gamepad2, GraduationCap, Heart,
    Home, Laptop, MoreHorizontal, Package, Pizza, Plane, ShoppingBag, Sparkles,
    Utensils, Wallet, Zap
} from 'lucide-react';
import { ReactNode } from 'react';

export interface TransactionRowData {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string;
    categoryIcon?: string;
    categoryColor?: string;
    responsibleName?: string;
    isPaid?: boolean;
    timestamp?: string;
}

interface TransactionRowProps {
    transaction: TransactionRowData;
    /** Callback ao clicar na linha */
    onClick?: () => void;
    /** Callback ao marcar como pago */
    onTogglePaid?: () => void;
    /** Callback ao deletar */
    onDelete?: () => void;
    /** Classes adicionais */
    className?: string;
}

// Mapa de ícones por categoria
const categoryIcons: Record<string, React.ElementType> = {
    alimentacao: Pizza,
    transporte: Car,
    casa: Home,
    lazer: Gamepad2,
    saude: Heart,
    educacao: GraduationCap,
    compras: ShoppingBag,
    tecnologia: Laptop,
    viagem: Plane,
    restaurante: Utensils,
    salario: Banknote,
    freelance: Laptop,
    investimento: Sparkles,
    outros: Package,
    energia: Zap,
    cartao: CreditCard,
    default: Wallet,
};

// Cores por categoria
const categoryColors: Record<string, string> = {
    alimentacao: 'var(--cat-orange)',
    transporte: 'var(--cat-cyan)',
    casa: 'var(--cat-blue)',
    lazer: 'var(--cat-purple)',
    saude: 'var(--cat-pink)',
    educacao: 'var(--cat-indigo)',
    compras: 'var(--cat-yellow)',
    tecnologia: 'var(--cat-teal)',
    viagem: 'var(--cat-cyan)',
    restaurante: 'var(--cat-orange)',
    salario: 'var(--accent-success)',
    freelance: 'var(--accent-success)',
    investimento: 'var(--cat-purple)',
    energia: 'var(--cat-yellow)',
    cartao: 'var(--cat-blue)',
    default: 'var(--text-tertiary)',
};

function formatCurrency(value: number): string {
    const prefix = value >= 0 ? '+' : '-';
    return `${prefix}R$ ${Math.abs(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function getCategoryKey(category?: string): string {
    if (!category) return 'default';
    const normalized = category.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');
    return categoryIcons[normalized] ? normalized : 'default';
}

/**
 * TransactionRow - Linha de transação refinada
 * 
 * Inclui ícone colorido por categoria, descrição, badge do responsável,
 * valor colorido e timestamp.
 */
export function TransactionRow({
    transaction,
    onClick,
    onTogglePaid,
    onDelete,
    className,
}: TransactionRowProps) {
    const {
        description,
        amount,
        type,
        category,
        responsibleName,
        isPaid,
        timestamp,
    } = transaction;

    const catKey = getCategoryKey(category);
    const Icon = categoryIcons[catKey];
    const color = categoryColors[catKey];
    const isExpense = type === 'expense';

    return (
        <div
            className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer",
                "hover:bg-[var(--bg-hover)] active:scale-[0.99]",
                isPaid && "opacity-60",
                className
            )}
            onClick={onClick}
        >
            {/* Ícone da categoria */}
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}20` }}
            >
                <Icon className="w-5 h-5" style={{ color }} />
            </div>

            {/* Informações */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p
                        className={cn(
                            "font-medium truncate",
                            isPaid && "line-through"
                        )}
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {description}
                    </p>
                    {isPaid && (
                        <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-success)' }} />
                    )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    {category && (
                        <span
                            className="text-xs"
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            {category}
                        </span>
                    )}
                    {responsibleName && (
                        <>
                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                            <span
                                className="text-xs px-1.5 py-0.5 rounded"
                                style={{
                                    backgroundColor: 'var(--cat-pink)',
                                    color: 'white',
                                    opacity: 0.9,
                                }}
                            >
                                {responsibleName}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Valor e Timestamp */}
            <div className="text-right shrink-0">
                <p
                    className="font-semibold"
                    style={{
                        color: isExpense ? 'var(--accent-danger)' : 'var(--accent-success)',
                    }}
                >
                    {formatCurrency(isExpense ? -Math.abs(amount) : amount)}
                </p>
                {timestamp && (
                    <p
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        {timestamp}
                    </p>
                )}
            </div>

            {/* Menu de ações (hover only em desktop) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    // Poderia abrir um dropdown
                }}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
                style={{ color: 'var(--text-tertiary)' }}
            >
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </div>
    );
}

/**
 * TransactionGroup - Agrupa transações por data
 */
interface TransactionGroupProps {
    /** Label da data (Hoje, Ontem, DD/MM) */
    dateLabel: string;
    /** Transações do grupo */
    transactions: TransactionRowData[];
    /** Callback ao clicar em uma transação */
    onTransactionClick?: (id: string) => void;
    /** Callback ao toggle pago */
    onTogglePaid?: (id: string) => void;
    /** Callback ao deletar */
    onDelete?: (id: string) => void;
    /** Classes adicionais */
    className?: string;
    children?: ReactNode;
}

export function TransactionGroup({
    dateLabel,
    transactions,
    onTransactionClick,
    onTogglePaid,
    onDelete,
    className,
    children,
}: TransactionGroupProps) {
    return (
        <div className={cn("space-y-1", className)}>
            {/* Header do grupo */}
            <div
                className="sticky top-14 z-10 py-2 px-1 flex items-center justify-between"
                style={{ backgroundColor: 'var(--bg-primary)' }}
            >
                <h3
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    {dateLabel}
                </h3>
                <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-muted)',
                    }}
                >
                    {transactions.length}
                </span>
            </div>

            {/* Lista de transações */}
            <div className="space-y-2">
                {children ? children : transactions.map((transaction) => (
                    <SwipeableRow
                        key={transaction.id}
                        onComplete={() => onTogglePaid?.(transaction.id)}
                        onDelete={() => onDelete?.(transaction.id)}
                        canComplete={transaction.type === 'expense' && !transaction.isPaid}
                        isCompleted={transaction.isPaid}
                    >
                        <TransactionRow
                            transaction={transaction}
                            onClick={() => onTransactionClick?.(transaction.id)}
                        />
                    </SwipeableRow>
                ))}
            </div>
        </div>
    );
}
