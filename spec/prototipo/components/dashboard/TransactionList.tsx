import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { AddTransactionDialog } from './AddTransactionDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export interface TransactionItem {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: 'income' | 'expense' | 'debt';
}

interface TransactionListProps {
  title: string;
  total: string;
  items: TransactionItem[];
  variant: 'income' | 'expense' | 'debt';
  collapsible?: boolean;
  onAddTransaction?: (item: Omit<TransactionItem, 'id' | 'type'>) => void;
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

  const Content = (
    <>
       <div className="flex flex-col gap-3 flex-1 mt-4">
        {items.map((item) => (
          <div key={item.id} className={cn("p-4 rounded-xl flex items-center justify-between transition-colors", itemBg)}>
            <div className="flex flex-col gap-1">
              <span className="text-gray-200 font-medium">{item.title}</span>
              <span className="text-xs text-gray-500">{item.date}</span>
            </div>
            <span className={cn("font-bold", amountColor)}>{item.amount}</span>
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
            if (onAddTransaction) onAddTransaction(data);
        }}
      />
    </div>
  );
}
