'use client';

import { transactionsService } from '@/services/transactionsService';
import { Transaction } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

// Tipo para contexto de rollback
type MutationContext = {
  previousQueries: [readonly unknown[], Transaction[] | undefined][];
};

/**
 * Hook para mutações de transações com Optimistic Updates
 * 
 * A UI atualiza imediatamente e o banco sincroniza em background.
 * Se falhar, reverte automaticamente e mostra toast de erro.
 */
export function useTransactionMutations() {
  const queryClient = useQueryClient();

  // Salva snapshot de todas as queries de transações
  const snapshotQueries = (): MutationContext['previousQueries'] => {
    return queryClient.getQueriesData<Transaction[]>({ queryKey: transactionKeys.all });
  };

  // Restaura queries do snapshot
  const rollback = (context: MutationContext | undefined) => {
    if (context?.previousQueries) {
      context.previousQueries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    }
  };

  // =====================
  // CREATE - Optimistic
  // =====================
  const createMutation = useMutation({
    mutationFn: (transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) =>
      transactionsService.create(transaction),

    onMutate: async (newTransaction) => {
      // Cancela queries em andamento
      await queryClient.cancelQueries({ queryKey: transactionKeys.all });

      // Snapshot para rollback
      const previousQueries = snapshotQueries();

      // Cria transação temporária com ID fake
      const tempTransaction: Transaction = {
        ...newTransaction,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        user_id: 'temp',
      } as Transaction;

      // Adiciona ao cache do mês correspondente
      const date = new Date(newTransaction.date);
      const monthKey = transactionKeys.byMonth(date.getMonth(), date.getFullYear());
      
      queryClient.setQueryData<Transaction[]>(monthKey, (old) => 
        old ? [tempTransaction, ...old] : [tempTransaction]
      );

      return { previousQueries };
    },

    onError: (err, _variables, context) => {
      rollback(context);
      toast.error('Erro ao criar transação. Tente novamente.');
      console.error('Create error:', err);
    },

    onSettled: () => {
      // Sincroniza com banco após sucesso ou erro
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });

  // =====================
  // UPDATE - Optimistic
  // =====================
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Transaction> }) =>
      transactionsService.update(id, updates),

    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: transactionKeys.all });

      const previousQueries = snapshotQueries();

      // Atualiza em todas as queries de transações
      queryClient.setQueriesData<Transaction[]>(
        { queryKey: transactionKeys.all },
        (old) => old?.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );

      return { previousQueries };
    },

    onError: (err, _variables, context) => {
      rollback(context);
      toast.error('Erro ao atualizar. Tente novamente.');
      console.error('Update error:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });

  // =====================
  // DELETE - Optimistic
  // =====================
  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: transactionKeys.all });

      const previousQueries = snapshotQueries();

      // Remove de todas as queries de transações
      queryClient.setQueriesData<Transaction[]>(
        { queryKey: transactionKeys.all },
        (old) => old?.filter((t) => t.id !== id)
      );

      return { previousQueries };
    },

    onError: (err, _variables, context) => {
      rollback(context);
      toast.error('Erro ao excluir. Tente novamente.');
      console.error('Delete error:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    isLoading: createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading,
  };
}

