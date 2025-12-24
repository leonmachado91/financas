import { supabase } from '@/supabase-clients/client';
import { PaymentMethod } from '@/types';

export const paymentMethodsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
        throw error;
    }
    return data as PaymentMethod[];
  },

  async create(method: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert(method)
      .select()
      .single();

    if (error) {
        throw error;
    }
    return data as PaymentMethod;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);

    if (error) {
        throw error;
    }
  },

  async update(id: string, updates: Partial<Omit<PaymentMethod, 'id' | 'user_id'>>) {
    const { data, error } = await supabase
      .from('payment_methods')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
        throw error;
    }
    return data as PaymentMethod;
  }
};
