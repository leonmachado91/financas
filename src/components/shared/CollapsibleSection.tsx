"use client";

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface CollapsibleSectionProps {
    /** Título da seção */
    title: string;
    /** Ícone opcional */
    icon?: React.ElementType;
    /** Cor do ícone e borda */
    color?: string;
    /** Contagem opcional (badge) */
    count?: number;
    /** Se começa aberto */
    defaultOpen?: boolean;
    /** Conteúdo da seção */
    children: React.ReactNode;
    /** Classes adicionais no container */
    className?: string;
    /** Variante de estilo */
    variant?: 'default' | 'warning' | 'danger' | 'success';
}

const variantStyles = {
    default: {
        bg: 'var(--bg-secondary)',
        border: 'var(--border-subtle)',
        text: 'var(--text-primary)',
    },
    warning: {
        bg: 'var(--accent-warning-bg)',
        border: 'var(--accent-warning)',
        text: 'var(--accent-warning)',
    },
    danger: {
        bg: 'var(--accent-danger-bg)',
        border: 'var(--accent-danger)',
        text: 'var(--accent-danger)',
    },
    success: {
        bg: 'var(--accent-success-bg)',
        border: 'var(--accent-success)',
        text: 'var(--accent-success)',
    },
};

/**
 * CollapsibleSection - Seção colapsável reutilizável
 * 
 * Usado para agrupar conteúdo com capacidade de expandir/colapsar.
 * Pode ser estilizado com diferentes variantes de cor.
 */
export function CollapsibleSection({
    title,
    icon: Icon,
    color,
    count,
    defaultOpen = true,
    children,
    className,
    variant = 'default',
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const styles = variantStyles[variant];
    const iconColor = color || styles.text;

    return (
        <div
            className={cn("rounded-2xl border overflow-hidden", className)}
            style={{
                backgroundColor: styles.bg,
                borderColor: styles.border,
            }}
        >
            {/* Header clicável */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    {Icon && (
                        <Icon className="w-5 h-5" style={{ color: iconColor }} />
                    )}
                    <span className="font-semibold" style={{ color: styles.text }}>
                        {title}
                        {count !== undefined && ` (${count})`}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-5 h-5" style={{ color: styles.text }} />
                </motion.div>
            </button>

            {/* Conteúdo colapsável com animação */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
