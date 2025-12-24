# Schema SQL - Finalização do App Finanças v3.0

Execute este SQL no Supabase **antes** de iniciar a Fase 3 (Personalização).

## Alterações em Categorias

```sql
-- Adiciona campos de personalização visual às categorias
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color TEXT;

-- Valores padrão para categorias existentes (opcional)
UPDATE categories SET 
  icon = CASE 
    WHEN name ILIKE '%aliment%' THEN 'pizza'
    WHEN name ILIKE '%transport%' THEN 'car'
    WHEN name ILIKE '%casa%' THEN 'home'
    WHEN name ILIKE '%lazer%' THEN 'gamepad2'
    WHEN name ILIKE '%saude%' OR name ILIKE '%saúde%' THEN 'heart'
    WHEN name ILIKE '%educa%' THEN 'graduation-cap'
    WHEN name ILIKE '%compra%' THEN 'shopping-bag'
    WHEN name ILIKE '%salario%' OR name ILIKE '%salário%' THEN 'banknote'
    ELSE 'wallet'
  END,
  color = CASE
    WHEN name ILIKE '%aliment%' THEN '#f97316'
    WHEN name ILIKE '%transport%' THEN '#06b6d4'
    WHEN name ILIKE '%casa%' THEN '#3b82f6'
    WHEN name ILIKE '%lazer%' THEN '#a855f7'
    WHEN name ILIKE '%saude%' OR name ILIKE '%saúde%' THEN '#ec4899'
    WHEN name ILIKE '%educa%' THEN '#6366f1'
    WHEN name ILIKE '%compra%' THEN '#eab308'
    WHEN name ILIKE '%salario%' OR name ILIKE '%salário%' THEN '#22c55e'
    ELSE '#6b7280'
  END
WHERE icon IS NULL OR color IS NULL;
```

---

## Alterações em Formas de Pagamento

```sql
-- Adiciona campos de personalização e detalhes extras
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}';

-- Valores padrão para métodos existentes (opcional)
UPDATE payment_methods SET 
  icon = CASE 
    WHEN name ILIKE '%pix%' THEN 'smartphone'
    WHEN name ILIKE '%credito%' OR name ILIKE '%crédito%' THEN 'credit-card'
    WHEN name ILIKE '%debito%' OR name ILIKE '%débito%' THEN 'credit-card'
    WHEN name ILIKE '%dinheiro%' THEN 'banknote'
    WHEN name ILIKE '%transfer%' THEN 'arrow-right-left'
    ELSE 'wallet'
  END,
  color = CASE
    WHEN name ILIKE '%pix%' THEN '#00bfa5'
    WHEN name ILIKE '%credito%' OR name ILIKE '%crédito%' THEN '#f59e0b'
    WHEN name ILIKE '%debito%' OR name ILIKE '%débito%' THEN '#3b82f6'
    WHEN name ILIKE '%dinheiro%' THEN '#22c55e'
    ELSE '#6b7280'
  END
WHERE icon IS NULL OR color IS NULL;
```

---

## Verificação

Após executar, verifique com:

```sql
SELECT id, name, icon, color FROM categories LIMIT 5;
SELECT id, name, icon, color, details FROM payment_methods LIMIT 5;
```

---

## Nota

Se as tabelas já tiverem as colunas, o `IF NOT EXISTS` evita erros.
Os `UPDATE` são opcionais e preenchem valores padrão baseados no nome.
