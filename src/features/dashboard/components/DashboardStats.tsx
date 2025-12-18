import { formatCurrency } from '@/lib/utils';
import { transactionsService } from '@/services/transactionsService';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';

export function DashboardStats() {
    const { data: overdueTransactions } = useQuery({
        queryKey: ['transactions', 'overdue'],
        queryFn: transactionsService.getOverdue,
        initialData: []
    });

    const totalOverdue = overdueTransactions.reduce((acc, t) => acc + Number(t.amount), 0);

    if (overdueTransactions.length === 0) return null;

    return (
        <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-zinc-900/50 border border-orange-900/30 rounded-2xl overflow-hidden">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900 transition-colors">
                    <div className="flex items-center gap-2 text-orange-500">
                        <ChevronDown size={20} />
                        <span className="font-bold text-lg">Pagamentos Atrasados</span>
                    </div>
                    <span className="text-orange-500 font-bold text-xl">
                        {formatCurrency(totalOverdue)}
                    </span>
                </div>

                <div className="bg-zinc-950/30 p-4 space-y-2">
                    {overdueTransactions.map(transaction => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                            <div className="flex flex-col">
                                <span className="text-red-400 font-medium">{transaction.description}</span>
                                <span className="text-zinc-500 text-xs">{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <span className="text-red-500 font-bold">
                                {formatCurrency(Number(transaction.amount))}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
