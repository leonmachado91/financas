import { cn, formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types';
import { Plus } from 'lucide-react';

interface TransactionListProps {
    title: string;
    type: 'income' | 'expense';
    transactions: Transaction[];
    total: number;
    onAdd: () => void;
}

export function TransactionList({ title, type, transactions, total, onAdd }: TransactionListProps) {
    const isIncome = type === 'income';
    const colorClass = isIncome ? 'text-green-500' : 'text-red-500';
    const bgClass = isIncome ? 'bg-green-500/10' : 'bg-red-500/10'; // Subtle background for container if needed

    return (
        <div className="flex-1 bg-zinc-900/30 rounded-3xl p-6 border border-zinc-800/50 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
                <h2 className={cn("text-xl font-bold", colorClass)}>{title}</h2>
                <span className={cn("text-xl font-bold", colorClass)}>{formatCurrency(total)}</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {transactions.map((t) => (
                    <div key={t.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center group hover:border-zinc-700 transition-colors">
                        <div className="flex flex-col">
                            <span className="font-medium text-zinc-200">{t.description}</span>
                            <span className="text-xs text-zinc-500">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <span className={cn("font-bold", colorClass)}>
                            {formatCurrency(Number(t.amount))}
                        </span>
                    </div>
                ))}
            </div>

            <button
                onClick={onAdd}
                className="mt-4 w-full py-4 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-colors flex items-center justify-center text-zinc-400 hover:text-white"
            >
                <Plus size={24} />
            </button>
        </div>
    );
}
