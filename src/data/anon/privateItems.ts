'use server';
import { createSupabaseClient } from '@/supabase-clients/server';
export const getUserPrivateItems = async (): Promise<
  Array<any>
> => {
  const supabase = await createSupabaseClient();
  const { data, error } = await (supabase as any).from('private_items').select('*');

  if (error) {
    throw error;
  }

  return data;
};

export const getPrivateItem = async (
  id: string
): Promise<any> => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('private_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
