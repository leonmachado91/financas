"use client";

import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Banknote, Car, Check, CreditCard, Gamepad2, GraduationCap, Heart,
    Home, Laptop, MoreHorizontal, Package, Pencil, Pizza, Plane, ShoppingBag,
    Sparkles, Trash2, Utensils, Wallet, Zap
} from 'lucide-react';

// ============================================
// TIPOS
// ============================================

export interface TransactionData {
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
    date?: string;
}

interface TransactionListItemProps {
    /** Dados da transação */
    transaction: TransactionData;
    /** Callback ao clicar na linha */
    onClick?: () => void;
    /** Callback ao marcar como pago */
    onTogglePaid?: () => void;
    /** Callback ao deletar */
    onDelete?: () => void;
    /** Exibir checkbox */
    showCheckbox?: boolean;
    /** Exibir ícone de categoria */
    showIcon?: boolean;
    /** Exibir data */
    showDate?: boolean;
    /** Exibir responsável */
    showResponsible?: boolean;
    /** Exibir menu de ações */
    showMenu?: boolean;
    /** Modo compacto (menos padding) */
    compact?: boolean;
    /** Classes adicionais */
    className?: string;
}

// ============================================
// MAPEAMENTOS
// ============================================

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

// ============================================
// HELPERS
// ============================================

function getCategoryKey(category?: string): string {
    if (!category) return 'default';
    const normalized = category.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');
    return categoryIcons[normalized] ? normalized : 'default';
}

function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    try {
        const date = parseISO(dateStr);
        return format(date, 'dd/MM', { locale: ptBR });
    } catch {
        return dateStr;
    }
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

/**
 * TransactionListItem - Item de transação unificado e configurável
 * 
 * Props controlam quais elementos são exibidos para adaptar
 * a diferentes contextos (atrasados, lista principal, split-view).
 */
export function TransactionListItem({
    transaction,
    onClick,
    onTogglePaid,
    onDelete,
    showCheckbox = false,
    showIcon = true,
    showDate = true,
    showResponsible = true,
    showMenu = true,
    compact = false,
    className,
}: TransactionListItemProps) {
    const {
        description,
        amount,
        type,
        category,
        responsibleName,
        isPaid,
        timestamp,
        date,
    } = transaction;

    const catKey = getCategoryKey(category);
    const Icon = categoryIcons[catKey];
    const color = categoryColors[catKey];
    const isExpense = type === 'expense';
    const dateStr = timestamp || date;

    return (
        <div
            className={cn(
                "flex items-center gap-3 rounded-xl transition-all cursor-pointer group",
                "hover:bg-[var(--bg-hover)] active:scale-[0.99]",
                compact ? "p-2" : "p-3",
                isPaid && "opacity-60",
                className
            )}
            onClick={onClick}
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
            {/* Checkbox (opcional) */}
            {showCheckbox && (
                <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={isPaid}
                        onCheckedChange={() => onTogglePaid?.()}
                        className={cn(
                            "data-[state=checked]:border-current",
                            isExpense
                                ? "data-[state=checked]:bg-[var(--accent-danger)]"
                                : "data-[state=checked]:bg-[var(--accent-success)]"
                        )}
                    />
                </div>
            )}

            {/* Ícone da categoria (opcional) */}
            {showIcon && (
                <div
                    className={cn(
                        "rounded-full flex items-center justify-center shrink-0",
                        compact ? "w-8 h-8" : "w-10 h-10"
                    )}
                    style={{ backgroundColor: `${color}20` }}
                >
                    <Icon className={compact ? "w-4 h-4" : "w-5 h-5"} style={{ color }} />
                </div>
            )}

            {/* Informações */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p
                        className={cn(
                            "font-medium truncate",
                            compact ? "text-sm" : "text-base",
                            isPaid && "line-through"
                        )}
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {description}
                    </p>
                    {isPaid && !showCheckbox && (
                        <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-success)' }} />
                    )}
                </div>
                <p
                    className="text-xs truncate mt-0.5"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    {category || 'Sem categoria'}
                    {showDate && dateStr && ` • ${formatDate(dateStr)}`}
                    {showResponsible && responsibleName && ` • ${responsibleName}`}
                </p>
            </div>

            {/* Valor */}
            <div
                className={cn(
                    "font-semibold shrink-0",
                    compact ? "text-sm" : "text-base"
                )}
                style={{
                    color: isExpense ? 'var(--accent-danger)' : 'var(--accent-success)',
                }}
            >
                {isExpense ? '-' : '+'}R$ {formatCurrency(amount)}
            </div>

            {/* Menu de ações (opcional) */}
            {showMenu && (
                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--bg-secondary)]"
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            style={{
                                backgroundColor: 'var(--bg-elevated)',
                                borderColor: 'var(--border-medium)',
                            }}
                        >
                            <DropdownMenuItem
                                onClick={onClick}
                                className="gap-2 cursor-pointer"
                            >
                                <Pencil className="w-4 h-4" />
                                Editar
                            </DropdownMenuItem>
                            {onTogglePaid && (
                                <DropdownMenuItem
                                    onClick={onTogglePaid}
                                    className="gap-2 cursor-pointer"
                                >
                                    <Check className="w-4 h-4" />
                                    {isPaid ? 'Marcar pendente' : 'Marcar pago'}
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <DropdownMenuItem
                                    onClick={onDelete}
                                    className="gap-2 cursor-pointer text-[var(--accent-danger)]"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Excluir
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
}

// ============================================
// LISTA DE TRANSAÇÕES
// ============================================

interface TransactionListProps {
    /** Lista de transações */
    transactions: TransactionData[];
    /** Callback ao clicar em uma transação */
    onItemClick?: (id: string) => void;
    /** Callback ao toggle pago */
    onTogglePaid?: (id: string) => void;
    /** Callback ao deletar */
    onDelete?: (id: string) => void;
    /** Props para os itens */
    itemProps?: Partial<Omit<TransactionListItemProps, 'transaction' | 'onClick' | 'onTogglePaid' | 'onDelete'>>;
    /** Classes adicionais */
    className?: string;
    /** Espaçamento entre itens */
    gap?: 'sm' | 'md';
}

/**
 * TransactionList - Lista de transações com configuração uniforme
 */
export function TransactionList({
    transactions,
    onItemClick,
    onTogglePaid,
    onDelete,
    itemProps = {},
    className,
    gap = 'sm',
}: TransactionListProps) {
    return (
        <div className={cn(
            "flex flex-col",
            gap === 'sm' ? 'gap-1' : 'gap-2',
            className
        )}>
            {transactions.map((transaction) => (
                <TransactionListItem
                    key={transaction.id}
                    transaction={transaction}
                    onClick={() => onItemClick?.(transaction.id)}
                    onTogglePaid={() => onTogglePaid?.(transaction.id)}
                    onDelete={() => onDelete?.(transaction.id)}
                    {...itemProps}
                />
            ))}
        </div>
    );
}
