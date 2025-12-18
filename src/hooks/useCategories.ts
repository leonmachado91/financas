'use client';

import { categoriesService } from '@/services/categoriesService';
import { useQuery } from '@tanstack/react-query';

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
};

/**
 * Hook para buscar todas as categorias
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoriesService.getAll(),
  });
}
