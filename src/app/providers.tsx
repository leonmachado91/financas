'use client';

import { TransactionSheetProvider } from '@/contexts/TransactionSheetContext';
import { queryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <TransactionSheetProvider>
                {children}
            </TransactionSheetProvider>
        </QueryClientProvider>
    );
}

