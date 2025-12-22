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
    Banknote, Car,
    Check,
    CreditCard,
    Gamepad2, GraduationCap, Heart,
    Home, Laptop,
    MoreHorizontal,
    Package,
    Pencil,
    Pizza, Plane, ShoppingBag, Sparkles,
    Trash2,
    Utensils, Wallet, Zap
} from 'lucide-react';

export interface TransactionTableData {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string;
    responsibleName?: string;
    isPaid?: boolean;
    date?: string;
}

interface TransactionTableProps {
    /** Lista de transações */
    transactions: TransactionTableData[];
    /** Callback ao clicar em editar */
    onEdit?: (id: string) => void;
    /** Callback ao clicar em deletar */
    onDelete?: (id: string) => void;
    /** Callback ao toggle pago */
    onTogglePaid?: (id: string) => void;
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

function getCategoryKey(category?: string): string {
    if (!category) return 'default';
    const normalized = category.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');
    return categoryIcons[normalized] ? normalized : 'default';
}

function formatCurrency(value: number, type: 'income' | 'expense'): string {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}R$ ${Math.abs(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    try {
        const date = parseISO(dateStr);
        return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
        return dateStr;
    }
}

/**
 * TransactionTable - Tabela de transações para desktop
 * 
 * Exibe transações em formato tabular com:
 * - Checkbox de status
 * - Ícone de categoria
 * - Colunas: Descrição, Categoria, Responsável, Data, Valor, Ações
 * - Hover actions
 */
export function TransactionTable({
    transactions,
    onEdit,
    onDelete,
    onTogglePaid,
    className,
}: TransactionTableProps) {
    if (transactions.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                "rounded-2xl overflow-hidden border",
                className
            )}
            style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
            }}
        >
            {/* Header */}
            <div
                className="grid grid-cols-[40px_1fr_140px_120px_120px_140px_60px] gap-4 px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider"
                style={{
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-tertiary)',
                }}
            >
                <div></div>
                <div>Descrição</div>
                <div>Categoria</div>
                <div>Responsável</div>
                <div>Data</div>
                <div className="text-right">Valor</div>
                <div></div>
            </div>

            {/* Rows */}
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {transactions.map((transaction) => {
                    const catKey = getCategoryKey(transaction.category);
                    const Icon = categoryIcons[catKey];
                    const color = categoryColors[catKey];
                    const isExpense = transaction.type === 'expense';

                    return (
                        <div
                            key={transaction.id}
                            className={cn(
                                "grid grid-cols-[40px_1fr_140px_120px_120px_140px_60px] gap-4 px-4 py-3 items-center group transition-colors",
                                "hover:bg-[var(--bg-hover)]",
                                transaction.isPaid && "opacity-60"
                            )}
                        >
                            {/* Checkbox */}
                            <div>
                                <Checkbox
                                    checked={transaction.isPaid}
                                    onCheckedChange={() => onTogglePaid?.(transaction.id)}
                                    className="data-[state=checked]:bg-[var(--accent-success)] data-[state=checked]:border-[var(--accent-success)]"
                                />
                            </div>

                            {/* Descrição com ícone */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${color}20` }}
                                >
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                                <span
                                    className={cn(
                                        "font-medium truncate",
                                        transaction.isPaid && "line-through"
                                    )}
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    {transaction.description}
                                </span>
                                {transaction.isPaid && (
                                    <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-success)' }} />
                                )}
                            </div>

                            {/* Categoria */}
                            <div
                                className="text-sm truncate"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                {transaction.category || '-'}
                            </div>

                            {/* Responsável */}
                            <div>
                                {transaction.responsibleName ? (
                                    <span
                                        className="text-xs px-2 py-1 rounded"
                                        style={{
                                            backgroundColor: 'var(--cat-pink)',
                                            color: 'white',
                                            opacity: 0.9,
                                        }}
                                    >
                                        {transaction.responsibleName}
                                    </span>
                                ) : (
                                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                                )}
                            </div>

                            {/* Data */}
                            <div
                                className="text-sm"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                {formatDate(transaction.date)}
                            </div>

                            {/* Valor */}
                            <div
                                className="text-right font-semibold"
                                style={{
                                    color: isExpense ? 'var(--accent-danger)' : 'var(--accent-success)',
                                }}
                            >
                                {formatCurrency(transaction.amount, transaction.type)}
                            </div>

                            {/* Ações */}
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--bg-tertiary)]"
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
                                            onClick={() => onEdit?.(transaction.id)}
                                            className="gap-2 cursor-pointer"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDelete?.(transaction.id)}
                                            className="gap-2 cursor-pointer text-[var(--accent-danger)] focus:text-[var(--accent-danger)]"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
