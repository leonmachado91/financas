/**
 * Constantes para mapeamento entre status da UI e do Banco de Dados
 * 
 * UI usa: 'completed' | 'pending'
 * DB usa: 'paid' | 'pending'
 */

// Status do banco de dados
export const DB_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
} as const;

// Status da interface
export const UI_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
} as const;

export type DbStatus = typeof DB_STATUS[keyof typeof DB_STATUS];
export type UiStatus = typeof UI_STATUS[keyof typeof UI_STATUS];

/**
 * Converte status do banco de dados para status da UI
 */
export const mapStatusToUI = (dbStatus: DbStatus): UiStatus => 
  dbStatus === DB_STATUS.PAID ? UI_STATUS.COMPLETED : UI_STATUS.PENDING;

/**
 * Converte status da UI para status do banco de dados
 */
export const mapStatusToDB = (uiStatus: UiStatus): DbStatus => 
  uiStatus === UI_STATUS.COMPLETED ? DB_STATUS.PAID : DB_STATUS.PENDING;
