-- Adiciona campos de personalização visual às categorias
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color TEXT;

-- Adiciona campos de personalização às formas de pagamento
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}';
