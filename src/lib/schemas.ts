import { z } from 'zod';

/**
 * Schema de validação para criação de transação
 */
export const transactionSchema = z.object({
  title: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(100, 'Descrição deve ter no máximo 100 caracteres'),
  amount: z
    .number({ invalid_type_error: 'Valor deve ser um número' })
    .positive('Valor deve ser positivo')
    .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais'),
  date: z
    .string()
    .min(1, 'Data é obrigatória')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  categoryId: z.string().nullable(),
  paymentMethodId: z.string().nullable(),
  profile: z.enum(['Leonardo', 'Flavia']).nullable().optional(),
  isPaid: z.boolean().optional().default(false),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

/**
 * Schema de validação para categoria
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Tipo deve ser receita ou despesa' }),
  }),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

/**
 * Schema de validação para método de pagamento
 */
export const paymentMethodSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
