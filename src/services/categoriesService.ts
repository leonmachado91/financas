import { supabase } from '@/supabase-clients/client';
import { Category } from '@/types';

export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
        throw error;
    }
    return data as Category[];
  },

  async create(category: Omit<Category, 'id' | 'user_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) {
        throw error;
    }
    return data as Category;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
        throw error;
    }
  }
};
