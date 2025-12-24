"use client";

import { TransactionData, TransactionList } from '@/components/shared/TransactionList';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';

export interface SplitTransactionData extends TransactionData {
    // Herda de TransactionData para compatibilidade
}

interface SplitTransactionViewProps {
    /** Lista de todas as transações */
    transactions: SplitTransactionData[];
    /** Callback ao clicar em editar */
    onEdit?: (id: string) => void;
    /** Callback ao clicar em deletar */
    onDelete?: (id: string) => void;
    /** Callback ao toggle pago */
    onTogglePaid?: (id: string) => void;
    /** Callback para adicionar receita */
    onAddIncome?: () => void;
    /** Callback para adicionar despesa */
    onAddExpense?: () => void;
    /** Classes adicionais */
    className?: string;
}

function formatCurrency(value: number): string {
    return `R$ ${Math.abs(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

// Coluna de transações usando TransactionList padronizado
function TransactionColumn({
    title,
    icon: Icon,
    color,
    transactions,
    total,
    onEdit,
    onDelete,
    onTogglePaid,
    onAdd,
}: {
    title: string;
    icon: React.ElementType;
    color: string;
    transactions: SplitTransactionData[];
    total: number;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onTogglePaid?: (id: string) => void;
    onAdd?: () => void;
}) {
    return (
        <div
            className="flex-1 rounded-2xl p-4 overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                    >
                        <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {title}
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {transactions.length} transações
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                            style={{ backgroundColor: `${color}20`, color }}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    )}
                    <div
                        className="text-lg font-bold"
                        style={{ color }}
                    >
                        {formatCurrency(total)}
                    </div>
                </div>
            </div>

            {/* Lista de transações usando TransactionList padronizado */}
            <div className="max-h-[400px] overflow-y-auto">
                {transactions.length === 0 ? (
                    <div
                        className="text-center py-8 text-sm"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        Nenhuma transação
                    </div>
                ) : (
                    <TransactionList
                        transactions={transactions}
                        onItemClick={onEdit}
                        onDelete={onDelete}
                        onTogglePaid={onTogglePaid}
                        itemProps={{
                            showCheckbox: true,
                            showIcon: false,
                            showDate: true,
                            showResponsible: true,
                            showMenu: true,
                            compact: true,
                        }}
                        gap="sm"
                    />
                )}
            </div>
        </div>
    );
}

/**
 * SplitTransactionView - Layout de duas colunas para desktop
 * 
 * Receitas à esquerda (verde) e Despesas à direita (vermelho).
 * Usa TransactionList padronizado para consistência visual.
 */
export function SplitTransactionView({
    transactions,
    onEdit,
    onDelete,
    onTogglePaid,
    onAddIncome,
    onAddExpense,
    className,
}: SplitTransactionViewProps) {
    // Separar transações por tipo
    const incomeTransactions = transactions.filter((t) => t.type === 'income');
    const expenseTransactions = transactions.filter((t) => t.type === 'expense');

    // Calcular totais
    const incomeTotal = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
    const expenseTotal = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className={cn("flex gap-4", className)}>
            {/* Coluna de Receitas */}
            <TransactionColumn
                title="Receitas"
                icon={ArrowUp}
                color="var(--accent-success)"
                transactions={incomeTransactions}
                total={incomeTotal}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePaid={onTogglePaid}
                onAdd={onAddIncome}
            />

            {/* Coluna de Despesas */}
            <TransactionColumn
                title="Despesas"
                icon={ArrowDown}
                color="var(--accent-danger)"
                transactions={expenseTransactions}
                total={expenseTotal}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePaid={onTogglePaid}
                onAdd={onAddExpense}
            />
        </div>
    );
}
