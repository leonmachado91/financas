import { useAppState } from '@/lib/appState';
import { cn, formatCurrency } from '@/lib/utils';
import { transactionsService } from '@/services/transactionsService';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect } from 'react';

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function MonthSelector() {
    const { selectedMonth, setSelectedMonth } = useAppState();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        const index = emblaApi.selectedScrollSnap();
        const newDate = new Date(selectedMonth.getFullYear(), index, 1);
        // Only update if month actually changed to avoid loops if needed, 
        // though setSelectedMonth should be stable.
        if (newDate.getMonth() !== selectedMonth.getMonth()) {
            setSelectedMonth(newDate);
        }
    }, [emblaApi, selectedMonth, setSelectedMonth]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
        // Initial scroll to current month
        emblaApi.scrollTo(selectedMonth.getMonth(), true);
    }, [emblaApi, onSelect]); // Removed selectedMonth from dependency to avoid re-scrolling on every state change if not needed

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <div className="relative max-w-4xl mx-auto py-6">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {MONTHS.map((month, index) => (
                        <div key={month} className="flex-[0_0_33%] min-w-0 relative px-2">
                            <MonthCard
                                monthName={month}
                                monthIndex={index}
                                isActive={index === selectedMonth.getMonth()}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white"
                onClick={scrollPrev}
            >
                <ChevronLeft size={32} />
            </button>
            <button
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white"
                onClick={scrollNext}
            >
                <ChevronRight size={32} />
            </button>
        </div>
    );
}

function MonthCard({ monthName, monthIndex, isActive }: { monthName: string, monthIndex: number, isActive: boolean }) {
    const { selectedMonth } = useAppState();

    // Fetch data for this month to show summary
    const { data: transactions } = useQuery({
        queryKey: ['transactions', monthIndex, selectedMonth.getFullYear()],
        queryFn: () => transactionsService.getByMonth(monthIndex, selectedMonth.getFullYear()),
        initialData: []
    });

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = income - expense;

    return (
        <div className={cn(
            "rounded-2xl p-4 transition-all duration-300 flex flex-col items-center justify-center text-center border border-transparent",
            isActive
                ? "bg-zinc-900 scale-110 border-zinc-800 shadow-2xl z-10 opacity-100"
                : "bg-zinc-950/50 scale-90 opacity-40 blur-[1px]"
        )}>
            {isActive && (
                <div className="absolute -top-3 bg-green-500 rounded-full p-1">
                    <ArrowUp size={16} className="text-black" />
                </div>
            )}

            <h3 className={cn(
                "font-bold uppercase tracking-wider mb-2",
                isActive ? "text-2xl text-zinc-100" : "text-lg text-zinc-500"
            )}>
                {monthName.slice(0, 3)}
            </h3>

            {isActive && (
                <div className="space-y-1 w-full">
                    <div className="flex justify-between text-xs px-2">
                        <span className="text-red-500">- {formatCurrency(expense)}</span>
                        <span className="text-green-500">+ {formatCurrency(income)}</span>
                    </div>
                    <div className={cn(
                        "text-xl font-bold mt-2",
                        balance >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                        {formatCurrency(balance)}
                    </div>
                </div>
            )}

            {!isActive && (
                <div className="space-y-1">
                    <div className="text-xs text-red-900">- {formatCurrency(expense)}</div>
                    <div className="text-xs text-green-900">+ {formatCurrency(income)}</div>
                </div>
            )}
        </div>
    );
}
