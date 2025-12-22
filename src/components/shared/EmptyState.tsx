"use client";

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Plus, Receipt } from 'lucide-react';

interface EmptyStateProps {
    /** Título */
    title?: string;
    /** Descrição */
    description?: string;
    /** Tipo de empty state para ilustração */
    type?: 'transactions' | 'stats' | 'generic';
    /** Ação primária */
    actionLabel?: string;
    /** Callback da ação */
    onAction?: () => void;
    /** Classes adicionais */
    className?: string;
}

/**
 * Ilustração SVG para empty state de transações
 */
function TransactionIllustration() {
    return (
        <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Círculo de fundo */}
            <circle
                cx="60"
                cy="60"
                r="50"
                fill="var(--bg-tertiary)"
            />

            {/* Recibo/Documento */}
            <motion.rect
                x="35"
                y="28"
                width="50"
                height="64"
                rx="6"
                fill="var(--bg-secondary)"
                stroke="var(--accent-lime)"
                strokeWidth="2"
                initial={{ y: 38 }}
                animate={{ y: 28 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            />

            {/* Linhas do recibo */}
            <motion.line
                x1="45"
                y1="45"
                x2="75"
                y2="45"
                stroke="var(--text-muted)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            />
            <motion.line
                x1="45"
                y1="55"
                x2="70"
                y2="55"
                stroke="var(--text-muted)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            />
            <motion.line
                x1="45"
                y1="65"
                x2="65"
                y2="65"
                stroke="var(--text-muted)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
            />

            {/* Cifrão */}
            <motion.circle
                cx="60"
                cy="80"
                r="12"
                fill="var(--accent-lime)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
            />
            <motion.text
                x="60"
                y="85"
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                $
            </motion.text>
        </motion.svg>
    );
}

/**
 * Ilustração genérica
 */
function GenericIllustration() {
    return (
        <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
            <Receipt className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
        </div>
    );
}

/**
 * EmptyState - Componente reutilizável para estados vazios
 */
export function EmptyState({
    title = "Nenhum item encontrado",
    description = "Comece adicionando algo novo",
    type = 'generic',
    actionLabel,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl",
                className
            )}
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
            {/* Ilustração */}
            <div className="mb-6">
                {type === 'transactions' ? (
                    <TransactionIllustration />
                ) : (
                    <GenericIllustration />
                )}
            </div>

            {/* Título */}
            <h3
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
            >
                {title}
            </h3>

            {/* Descrição */}
            <p
                className="text-sm max-w-[250px] mb-6"
                style={{ color: 'var(--text-tertiary)' }}
            >
                {description}
            </p>

            {/* Ação */}
            {actionLabel && onAction && (
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onAction}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium"
                    style={{
                        backgroundColor: 'var(--accent-lime)',
                        color: 'black',
                    }}
                >
                    <Plus className="w-5 h-5" />
                    {actionLabel}
                </motion.button>
            )}
        </motion.div>
    );
}
