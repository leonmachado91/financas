"use client";

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    Banknote, Car, CreditCard, Gamepad2, GraduationCap, Heart,
    Home, Laptop,
    Pizza, Plane, ShoppingBag, Sparkles,
    Utensils, Wallet, Zap
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    icon?: string | null;
    color?: string | null;
}

interface CategoryGridProps {
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
 * CategoryGrid - Grid de categorias para filtro rápido
 * 
 * Exibe ícones de categorias em grid com scroll horizontal.
 * Tap para filtrar transações por categoria.
 */
export function CategoryGrid({
    categories,
    selectedId,
    onSelect,
    className,
}: CategoryGridProps) {
    // Adiciona opção "Todas" no início
    const allCategories = [
        { id: '__all__', name: 'Todas', icon: 'default' },
        ...categories,
    ];

    return (
        <div className={cn("relative", className)}>
            {/* Scroll horizontal */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allCategories.map((cat) => {
                    const catKey = getCategoryKey(cat.name);
                    const Icon = categoryIcons[catKey] || Wallet;
                    const color = cat.color || categoryColors[catKey] || categoryColors.default;
                    const isSelected = cat.id === '__all__'
                        ? selectedId === null
                        : selectedId === cat.id;

                    return (
                        <motion.button
                            key={cat.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect?.(cat.id === '__all__' ? null : cat.id)}
                            className={cn(
                                "flex flex-col items-center gap-1.5 p-3 rounded-xl min-w-[72px] transition-all",
                                isSelected
                                    ? "bg-[var(--accent-lime)] shadow-lg"
                                    : "bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    isSelected ? "bg-black/20" : ""
                                )}
                                style={{
                                    backgroundColor: isSelected ? undefined : `${color}20`,
                                }}
                            >
                                <Icon
                                    className="w-5 h-5"
                                    style={{
                                        color: isSelected ? 'black' : color,
                                    }}
                                />
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-medium truncate max-w-full",
                                    isSelected ? "text-black" : "text-[var(--text-secondary)]"
                                )}
                            >
                                {cat.name}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * CategoryGridCompact - Versão compacta com apenas ícones
 */
export function CategoryGridCompact({
    categories,
    selectedId,
    onSelect,
    className,
}: CategoryGridProps) {
    return (
        <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
            {categories.slice(0, 8).map((cat) => {
                const catKey = getCategoryKey(cat.name);
                const Icon = categoryIcons[catKey] || Wallet;
                const color = cat.color || categoryColors[catKey] || categoryColors.default;
                const isSelected = selectedId === cat.id;

                return (
                    <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onSelect?.(isSelected ? null : cat.id)}
                        className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                            isSelected
                                ? "ring-2 ring-offset-2 ring-[var(--accent-lime)] ring-offset-[var(--bg-primary)]"
                                : ""
                        )}
                        style={{
                            backgroundColor: `${color}20`,
                        }}
                    >
                        <Icon
                            className="w-5 h-5"
                            style={{ color }}
                        />
                    </motion.button>
                );
            })}
        </div>
    );
}
