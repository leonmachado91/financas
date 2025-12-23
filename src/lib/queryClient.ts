import { QueryClient } from '@tanstack/react-query';

/**
 * Configuração padrão do QueryClient para o aplicativo.
 * 
 * Optimistic Updates habilitados para UX fluida:
 * - staleTime: 5 minutos - dados são considerados frescos por esse período
 * - gcTime: 30 minutos - dados são mantidos em cache por esse período
 * - retry: 1 - tenta apenas uma vez em caso de erro
 * - refetchOnWindowFocus: false - NÃO revalida ao voltar para aba (evita loading desnecessário)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 30, // 30 minutos
      retry: 1,
      refetchOnWindowFocus: false, // Desabilitado para UX mais fluida
    },
    mutations: {
      retry: 1,
    },
  },
});

