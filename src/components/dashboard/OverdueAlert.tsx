"use client";

import { cn } from '@/lib/utils';
import { AlertTriangle, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

interface OverdueAlertProps {
    /** Número de itens atrasados */
    count: number;
    /** Total em valor atrasado */
    totalAmount?: number;
    /** Callback ao clicar para ver detalhes */
    onClick?: () => void;
    /** Callback ao dispensar o alerta */
    onDismiss?: () => void;
    /** Classes adicionais */
    className?: string;
}

function formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}

/**
 * OverdueAlert - Alerta compacto para pagamentos atrasados
 * 
 * Banner discreto que aparece no topo do dashboard
 * quando há pagamentos em atraso.
 */
export function OverdueAlert({
    count,
    totalAmount,
    onClick,
    onDismiss,
    className,
}: OverdueAlertProps) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed || count === 0) return null;

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDismissed(true);
        onDismiss?.();
    };

    return (
        <div
            className={cn(
                "flex items-center justify-between gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                "hover:brightness-110",
                className
            )}
            style={{
                backgroundColor: 'var(--accent-warning-bg)',
                border: '1px solid var(--accent-warning)',
            }}
            onClick={onClick}
        >
            {/* Ícone e Texto */}
            <div className="flex items-center gap-3 min-w-0">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--accent-warning)' }}
                >
                    <AlertTriangle className="w-4 h-4 text-black" />
                </div>
                <div className="min-w-0">
                    <p
                        className="font-medium text-sm"
                        style={{ color: 'var(--accent-warning)' }}
                    >
                        {count} pagamento{count > 1 ? 's' : ''} atrasado{count > 1 ? 's' : ''}
                    </p>
                    {totalAmount && (
                        <p
                            className="text-xs truncate"
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            Total: {formatCurrency(totalAmount)}
                        </p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
                <span
                    className="text-xs font-medium hidden sm:inline"
                    style={{ color: 'var(--accent-warning)' }}
                >
                    Ver detalhes
                </span>
                <ChevronRight
                    className="w-4 h-4"
                    style={{ color: 'var(--accent-warning)' }}
                />
                {onDismiss && (
                    <button
                        onClick={handleDismiss}
                        className="p-1 rounded-full hover:bg-black/10 transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
