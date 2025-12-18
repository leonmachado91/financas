import { AppSupabaseClient } from '@/types';

export const getAllPrivateItems = async (
  supabase: AppSupabaseClient
): Promise<Array<any>> => {
  const { data, error } = await (supabase as any).from('private_items').select('*');

  if (error) {
    throw error;
  }

  return data;
};

export const deletePrivateItem = async (
  supabase: AppSupabaseClient,
  id: string
) => {
  const { error } = await (supabase as any).from('private_items').delete().match({ id });

  if (error) {
    throw error;
  }

  return true;
};

export const getPrivateItem = async (
  supabase: AppSupabaseClient,
  id: string
): Promise<any> => {
  const { data, error } = await (supabase as any)
    .from('private_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
