import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from './supabase';

// ============= Tipos de Transação =============

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
    category_id?: string | null;
    payment_method_id?: string | null;
    status: 'paid' | 'pending';
    profile?: 'Leonardo' | 'Flavia' | null;
    user_id: string;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    user_id: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
    user_id: string;
}

export interface AppState {
    transactions: Transaction[];
    categories: Category[];
    paymentMethods: PaymentMethod[];
    isLoading: boolean;
    error: string | null;
}

// ============= Tipos de Usuário =============

// Perfis de usuário disponíveis no app
export type UserProfile = 'Leonardo' | 'Compartilhado';

// ============= Tipos de Autenticação =============

// Provedores de autenticação social
export type AuthProvider = 'google' | 'github' | 'facebook' | 'twitter' | 'apple';

// Estado de autenticação do usuário
export interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

// ============= Tipos do Supabase =============

export type AppSupabaseClient = SupabaseClient<Database>;

