"use client";

import { cn } from '@/lib/utils';
import {
    Banknote, Car, CreditCard, Gamepad2, GraduationCap, Heart,
    Home, Laptop, ListFilter,
    Pizza, Plane, ShoppingBag, Sparkles,
    Utensils, Wallet, Zap
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    icon?: string;
    color?: string;
}

interface CategoryTabsProps {
    /** Lista de categorias */
    categories: Category[];
    /** Categoria selecionada (null = todas) */
    selectedId?: string | null;
    /** Callback ao selecionar categoria */
    onSelect?: (id: string | null) => void;
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

function getCategoryKey(name?: string): string {
    if (!name) return 'default';
    const normalized = name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');
    return categoryIcons[normalized] ? normalized : 'default';
}

/**
 * CategoryTabs - Tabs inline para filtro de categorias (Desktop)
 * 
 * Versão compacta em pills para desktop.
 * Scrollável horizontalmente se muitas categorias.
 */
export function CategoryTabs({
    categories,
    selectedId,
    onSelect,
    className,
}: CategoryTabsProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* Ícone de filtro */}
            <ListFilter
                className="w-4 h-4 shrink-0"
                style={{ color: 'var(--text-tertiary)' }}
            />

            {/* Pills scrolláveis */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {/* Tab "Todas" */}
                <button
                    onClick={() => onSelect?.(null)}
                    className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                        selectedId === null
                            ? "bg-[var(--accent-lime)] text-black"
                            : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                    )}
                >
                    Todas
                </button>

                {/* Pills de categorias */}
                {categories.map((cat) => {
                    const catKey = getCategoryKey(cat.name);
                    const Icon = categoryIcons[catKey] || Wallet;
                    const color = cat.color || categoryColors[catKey] || categoryColors.default;
                    const isSelected = selectedId === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelect?.(isSelected ? null : cat.id)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                isSelected
                                    ? "text-white"
                                    : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                            )}
                            style={{
                                backgroundColor: isSelected ? color : undefined,
                            }}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {cat.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
