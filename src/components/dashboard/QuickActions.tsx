"use client";

import { cn } from '@/lib/utils';
import { ArrowDownCircle, ArrowUpCircle, Target } from 'lucide-react';

interface QuickActionsProps {
    /** Callback ao clicar em adicionar receita */
    onAddIncome?: () => void;
    /** Callback ao clicar em adicionar despesa */
    onAddExpense?: () => void;
    /** Callback ao clicar em definir meta */
    onSetGoal?: () => void;
    /** Classes adicionais */
    className?: string;
    /** Mostrar botão de meta */
    showGoalButton?: boolean;
}

interface ActionButtonProps {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    variant: 'income' | 'expense' | 'neutral';
}

function ActionButton({ icon: Icon, label, onClick, variant }: ActionButtonProps) {
    const variantStyles = {
        income: {
            bg: 'var(--accent-success-bg)',
            border: 'var(--accent-success)',
            text: 'var(--accent-success)',
            iconBg: 'rgba(34, 197, 94, 0.2)',
        },
        expense: {
            bg: 'var(--accent-danger-bg)',
            border: 'var(--accent-danger)',
            text: 'var(--accent-danger)',
            iconBg: 'rgba(239, 68, 68, 0.2)',
        },
        neutral: {
            bg: 'var(--bg-tertiary)',
            border: 'var(--border-medium)',
            text: 'var(--text-secondary)',
            iconBg: 'var(--bg-elevated)',
        },
    };

    const styles = variantStyles[variant];

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl",
                "border transition-all active:scale-[0.98]",
                "hover:brightness-110"
            )}
            style={{
                backgroundColor: styles.bg,
                borderColor: styles.border,
            }}
        >
            <div
                className="p-1.5 rounded-lg"
                style={{ backgroundColor: styles.iconBg }}
            >
                <Icon className="w-4 h-4" style={{ color: styles.text }} />
            </div>
            <span
                className="text-sm font-medium"
                style={{ color: styles.text }}
            >
                {label}
            </span>
        </button>
    );
}

/**
 * QuickActions - Botões de ação rápida para adicionar transações
 * 
 * Estilo pill com ícones e cores semânticas.
 */
export function QuickActions({
    onAddIncome,
    onAddExpense,
    onSetGoal,
    className,
    showGoalButton = false,
}: QuickActionsProps) {
    return (
        <div className={cn("flex gap-3", className)}>
            <ActionButton
                icon={ArrowUpCircle}
                label="Receita"
                onClick={onAddIncome}
                variant="income"
            />
            <ActionButton
                icon={ArrowDownCircle}
                label="Despesa"
                onClick={onAddExpense}
                variant="expense"
            />
            {showGoalButton && (
                <ActionButton
                    icon={Target}
                    label="Meta"
                    onClick={onSetGoal}
                    variant="neutral"
                />
            )}
        </div>
    );
}
