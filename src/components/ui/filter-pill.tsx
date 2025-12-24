"use client";

import { cn } from '@/lib/utils';

export type FilterPillVariant = 'default' | 'success' | 'danger' | 'warning' | 'lime';

interface FilterPillProps {
    /** Texto do pill */
    children: React.ReactNode;
    /** Variante de cor */
    variant?: FilterPillVariant;
    /** Se está selecionado */
    selected?: boolean;
    /** Callback ao clicar */
    onClick?: () => void;
    /** Ícone opcional */
    icon?: React.ElementType;
    /** Contagem opcional */
    count?: number;
    /** Classes adicionais */
    className?: string;
    /** Tamanho */
    size?: 'sm' | 'md';
}

const variantStyles: Record<FilterPillVariant, {
    bg: string;
    bgSelected: string;
    text: string;
    textSelected: string;
}> = {
    default: {
        bg: 'var(--bg-tertiary)',
        bgSelected: 'var(--accent-lime)',
        text: 'var(--text-secondary)',
        textSelected: 'black',
    },
    lime: {
        bg: 'var(--bg-tertiary)',
        bgSelected: 'var(--accent-lime)',
        text: 'var(--text-secondary)',
        textSelected: 'black',
    },
    success: {
        bg: 'var(--accent-success-bg)',
        bgSelected: 'var(--accent-success)',
        text: 'var(--accent-success)',
        textSelected: 'white',
    },
    danger: {
        bg: 'var(--accent-danger-bg)',
        bgSelected: 'var(--accent-danger)',
        text: 'var(--accent-danger)',
        textSelected: 'white',
    },
    warning: {
        bg: 'var(--accent-warning-bg)',
        bgSelected: 'var(--accent-warning)',
        text: 'var(--accent-warning)',
        textSelected: 'black',
    },
};

/**
 * FilterPill - Botão de filtro padronizado em formato de pill
 * 
 * Usado para filtros de categoria, tipo de transação, etc.
 * Garante consistência visual em todo o app.
 */
export function FilterPill({
    children,
    variant = 'default',
    selected = false,
    onClick,
    icon: Icon,
    count,
    className,
    size = 'md',
}: FilterPillProps) {
    const styles = variantStyles[variant];

    const sizeClasses = size === 'sm'
        ? 'px-2.5 py-1 text-xs gap-1'
        : 'px-3 py-1.5 text-[var(--pill-font-size)] gap-1.5';

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center font-medium transition-all whitespace-nowrap rounded-full",
                "hover:opacity-90 active:scale-95",
                sizeClasses,
                className
            )}
            style={{
                backgroundColor: selected ? styles.bgSelected : styles.bg,
                color: selected ? styles.textSelected : styles.text,
            }}
        >
            {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
            <span>{children}</span>
            {count !== undefined && (
                <span className="opacity-70">({count})</span>
            )}
        </button>
    );
}

/**
 * FilterPillGroup - Container para grupo de FilterPills
 */
export function FilterPillGroup({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex items-center gap-2 overflow-x-auto scrollbar-hide", className)}>
            {children}
        </div>
    );
}
