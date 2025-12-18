'use client';

import { transactionsService } from '@/services/transactionsService';
import { Transaction } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query Keys
export const transactionKeys = {
  all: ['transactions'] as const,
  byMonth: (month: number, year: number) => [...transactionKeys.all, 'month', month, year] as const,
  overdue: () => [...transactionKeys.all, 'overdue'] as const,
};

/**
 * Hook para buscar transações de um mês específico
 */
export function useTransactionsByMonth(month: number, year: number) {
  return useQuery({
    queryKey: transactionKeys.byMonth(month, year),
    queryFn: () => transactionsService.getByMonth(month, year),
    enabled: month >= 0 && year > 0,
  });
}

/**
 * Hook para buscar transações atrasadas
 */
export function useOverdueTransactions() {
  return useQuery({
    queryKey: transactionKeys.overdue(),
    queryFn: () => transactionsService.getOverdue(),
  });
}

/**
 * Hook para mutações de transações (criar, atualizar, deletar)
 */
export function useTransactionMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: transactionKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: (transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) =>
      transactionsService.create(transaction),
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Transaction> }) =>
      transactionsService.update(id, updates),
    onSuccess: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: invalidateAll,
  });

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    isLoading: createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading,
  };
}
