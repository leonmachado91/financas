import { supabase } from '@/supabase-clients/client';
import { Transaction } from '@/types';

export const transactionsService = {
  async getByMonth(month: number, year: number) {
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 0).toISOString();

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
        throw error;
    }
    return data as Transaction[];
  },

  async getOverdue() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('status', 'pending')
      .lt('date', today)
      .order('date', { ascending: true });

    if (error) {
        throw error;
    }
    return data as Transaction[];
  },

  async create(transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) {
        throw error;
    }
    return data as Transaction;
  },

  async update(id: string, updates: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
        throw error;
    }
    return data as Transaction;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
        throw error;
    }
  }
};
