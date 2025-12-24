"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useTransactionSheet } from '@/contexts/TransactionSheetContext';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { useState } from 'react';

interface AddTransactionPopoverProps {
    /** Se o popover está aberto (controlado externamente) */
    open?: boolean;
    /** Callback quando estado muda */
    onOpenChange?: (open: boolean) => void;
    /** Side do popover */
    side?: 'top' | 'bottom' | 'left' | 'right';
    /** Align do popover */
    align?: 'start' | 'center' | 'end';
    /** Se deve mostrar o botão FAB (ou apenas o popover) */
    showTrigger?: boolean;
    /** Classes para o container do trigger */
    triggerClassName?: string;
    /** Children customizado para o trigger (substitui o FAB padrão) */
    children?: React.ReactNode;
}

/**
 * AddTransactionPopover - Popover padronizado para adicionar transações
 * 
 * Extrai a lógica do BottomNav para ser reutilizado em mobile e desktop.
 * Garante mesmo visual em qualquer lugar do app.
 */
export function AddTransactionPopover({
    open: controlledOpen,
    onOpenChange,
    side = 'top',
    align = 'center',
    showTrigger = true,
    triggerClassName,
    children,
}: AddTransactionPopoverProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const { openAddSheet } = useTransactionSheet();

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    const handleSelect = (type: 'income' | 'expense') => {
        setOpen(false);
        openAddSheet(type);
    };

    const trigger = children || (
        <button
            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95"
            style={{
                background: 'var(--gradient-lime)',
                boxShadow: 'var(--shadow-lime)'
            }}
        >
            <Plus className="w-7 h-7 text-black" strokeWidth={2.5} />
        </button>
    );

    return (
        <Popover open={isOpen} onOpenChange={setOpen}>
            {showTrigger && (
                <PopoverTrigger asChild className={triggerClassName}>
                    {trigger}
                </PopoverTrigger>
            )}
            <PopoverContent
                className="w-48 p-2"
                side={side}
                sideOffset={12}
                align={align}
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)'
                }}
            >
                <div className="flex flex-col gap-1">
                    {/* Opção Receita */}
                    <button
                        onClick={() => handleSelect('income')}
                        className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: 'var(--accent-success-bg)' }}
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--accent-success)' }}
                        >
                            <ArrowUp className="w-4 h-4 text-black" />
                        </div>
                        <span className="font-medium" style={{ color: 'var(--accent-success)' }}>
                            Receita
                        </span>
                    </button>

                    {/* Opção Despesa */}
                    <button
                        onClick={() => handleSelect('expense')}
                        className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: 'var(--accent-danger-bg)' }}
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--accent-danger)' }}
                        >
                            <ArrowDown className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium" style={{ color: 'var(--accent-danger)' }}>
                            Despesa
                        </span>
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
