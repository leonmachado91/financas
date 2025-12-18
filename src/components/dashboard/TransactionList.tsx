import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AddTransactionDialog } from './AddTransactionDialog';

export interface TransactionItem {
    id: string;
    title: string;
    date: string;
    amount: string;
    type: 'income' | 'expense' | 'debt';
    status: 'pending' | 'completed';
    categoryName?: string;
    profileName?: string;
}

interface TransactionListProps {
    title: string;
    total: string;
    items: TransactionItem[];
    variant: 'income' | 'expense' | 'debt';
    collapsible?: boolean;
    onAddTransaction?: (data: { title: string; amount: number; date: string; categoryId: string | null; paymentMethodId: string | null; profile: 'Leonardo' | 'Flavia' | null }) => Promise<void>;
    onToggleStatus?: (id: string, currentStatus: 'pending' | 'completed') => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    filterOptions?: {
        label: string;
        value: string;
    }[];
    currentFilter?: string;
    onFilterChange?: (value: string) => void;
}

export function TransactionList({
    title,
    total,
    items,
    variant,
    collapsible = false,
    onAddTransaction,
    onToggleStatus,
    onEdit,
    onDelete,
    filterOptions,
    currentFilter,
    onFilterChange
}: TransactionListProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [showAddDialog, setShowAddDialog] = useState(false);

    const isDebt = variant === 'debt';
    const isIncome = variant === 'income';
    const isExpense = variant === 'expense';

    // Variant Styles
    const containerBg = isDebt
        ? "bg-[#2A1810]/80 border-orange-900/30"
        : isIncome
            ? "bg-[#141F16]/80 border-green-900/30"
            : "bg-[#1F1414]/80 border-red-900/30";

    const headerColor = isDebt ? "text-orange-500" : isIncome ? "text-green-500" : "text-red-500";

    const itemBg = isDebt
        ? "bg-[#3A2015]/50 hover:bg-[#3A2015]"
        : isIncome
            ? "bg-[#1A2C21]/50 hover:bg-[#1A2C21]"
            : "bg-[#2C1A1A]/50 hover:bg-[#2C1A1A]";

    const amountColor = isDebt ? "text-red-500" : isIncome ? "text-green-500" : "text-red-500";

    // Empty state messages based on variant
    const getEmptyStateMessage = () => {
        switch (variant) {
            case 'income':
                return 'Nenhuma receita registrada este mês';
            case 'expense':
                return 'Nenhuma despesa registrada este mês';
            case 'debt':
                return '🎉 Nenhuma pendência! Tudo em dia.';
            default:
                return 'Nenhum item encontrado';
        }
    };

    const Content = (
        <>
            <div className="flex flex-col gap-3 flex-1 mt-4">
                {items.length === 0 ? (
                    <div className={cn(
                        "p-6 rounded-xl text-center",
                        isDebt ? "text-orange-400/70" : isIncome ? "text-green-400/70" : "text-red-400/70"
                    )}>
                        <p className="text-sm">{getEmptyStateMessage()}</p>
                    </div>
                ) : items.map((item) => (
                    <div key={item.id} className={cn("p-4 rounded-xl flex items-center justify-between transition-colors group", itemBg)}>
                        <div className="flex items-center gap-3">
                            {onToggleStatus && (
                                <Checkbox
                                    checked={item.status === 'completed'}
                                    onCheckedChange={() => onToggleStatus(item.id, item.status)}
                                    className={cn(
                                        "border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                                        isDebt ? "data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" : ""
                                    )}
                                />
                            )}
                            <div className="flex flex-col gap-1">
                                <span className={cn(
                                    "text-gray-200 font-medium transition-all",
                                    item.status === 'completed' ? "line-through opacity-50" : ""
                                )}>{item.title}</span>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{item.date}</span>
                                    {item.categoryName && (
                                        <>
                                            <span>•</span>
                                            <span className="text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{item.categoryName}</span>
                                        </>
                                    )}
                                    {item.profileName && (
                                        <>
                                            <span>•</span>
                                            <span className="text-pink-400/80 bg-pink-500/10 px-1.5 py-0.5 rounded">{item.profileName}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "font-bold transition-all",
                                amountColor,
                                item.status === 'completed' ? "opacity-50" : ""
                            )}>{item.amount}</span>

                            {onEdit && (
                                <button
                                    onClick={() => onEdit(item.id)}
                                    className="text-gray-600 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}

                            {onDelete && (
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {onAddTransaction && (
                <button
                    onClick={() => setShowAddDialog(true)}
                    className="w-full py-3 mt-2 flex items-center justify-center text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
                >
                    <Plus className="w-6 h-6" />
                </button>
            )}
        </>
    );

    // If filterOptions are provided, we render the header with a dropdown instead of collapsible
    const HeaderContent = (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                {filterOptions ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                            <ChevronDown className={cn("w-4 h-4", isDebt ? "text-orange-500" : "text-gray-400")} />
                            <h3 className={cn("font-bold text-lg cursor-pointer", headerColor)}>{title}</h3>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-[#1C1C1C] border-gray-800 text-white">
                            {filterOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => onFilterChange?.(option.value)}
                                    className="hover:bg-gray-800 cursor-pointer"
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <h3 className={cn("font-bold text-lg", headerColor)}>{title}</h3>
                )}
            </div>
            <span className={cn("font-bold text-lg", headerColor)}>{total}</span>
        </div>
    );

    return (
        <div className={cn("rounded-3xl border p-6 flex flex-col h-full transition-all", containerBg)}>
            {collapsible ? (
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                    <div className="flex items-center justify-between">
                        <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen ? "" : "-rotate-90", isDebt ? "text-orange-500" : "text-gray-400")} />
                            <h3 className={cn("font-bold text-lg", headerColor)}>{title}</h3>
                        </CollapsibleTrigger>
                        <span className={cn("font-bold text-lg", headerColor)}>{total}</span>
                    </div>
                    <CollapsibleContent className="space-y-2 animate-in slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2">
                        {Content}
                    </CollapsibleContent>
                </Collapsible>
            ) : (
                <>
                    {HeaderContent}
                    {Content}
                </>
            )}

            <AddTransactionDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                type={variant}
                onAdd={(data) => {
                    if (onAddTransaction) return onAddTransaction(data);
                    return Promise.resolve();
                }}
            />
        </div>
    );
}
