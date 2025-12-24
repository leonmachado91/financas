'use client';

import { paymentMethodsService } from '@/services/paymentMethodsService';
import { useQuery } from '@tanstack/react-query';

// Query Keys
export const paymentMethodKeys = {
  all: ['payment_methods'] as const,
};

/**
 * Hook para buscar todas as formas de pagamento
 */
export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodKeys.all,
    queryFn: () => paymentMethodsService.getAll(),
  });
}
