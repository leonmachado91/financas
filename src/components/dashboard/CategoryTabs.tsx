"use client";

import { FilterPill, FilterPillGroup } from '@/components/ui/filter-pill';
import {
    Banknote, Car, CreditCard, Gamepad2, GraduationCap, Heart,
    Home, Laptop, ListFilter,
    Pizza, Plane, ShoppingBag, Sparkles,
    Utensils, Wallet, Zap
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    icon?: string | null;
    color?: string | null;
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
 * Usa FilterPill padronizado para consistência visual.
 * Scrollável horizontalmente se muitas categorias.
 */
export function CategoryTabs({
    categories,
    selectedId,
    onSelect,
    className,
}: CategoryTabsProps) {
    return (
        <div className={`flex items-center gap-2 ${className || ''}`}>
            {/* Ícone de filtro */}
            <ListFilter
                className="w-4 h-4 shrink-0"
                style={{ color: 'var(--text-tertiary)' }}
            />

            {/* Pills scrolláveis usando FilterPillGroup */}
            <FilterPillGroup>
                {/* Tab "Todas" */}
                <FilterPill
                    variant="lime"
                    selected={selectedId === null}
                    onClick={() => onSelect?.(null)}
                >
                    Todas
                </FilterPill>

                {/* Pills de categorias */}
                {categories.map((cat) => {
                    const catKey = getCategoryKey(cat.name);
                    const Icon = categoryIcons[catKey] || Wallet;
                    const isSelected = selectedId === cat.id;

                    return (
                        <FilterPill
                            key={cat.id}
                            variant="default"
                            selected={isSelected}
                            onClick={() => onSelect?.(isSelected ? null : cat.id)}
                            icon={Icon}
                        >
                            {cat.name}
                        </FilterPill>
                    );
                })}
            </FilterPillGroup>
        </div>
    );
}
