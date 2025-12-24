# Proposta: Auditoria e Componentização Completa

## Objetivo

Padronizar TODOS os componentes visuais do aplicativo Finanças, eliminando duplicação e garantindo consistência.

---

## Componentes a Criar/Unificar

### 1. LISTAS E TABELAS

| Componente | Uso | Props Configuráveis |
|------------|-----|---------------------|
| `TransactionListItem` | Item de transação em qualquer lista | `showCheckbox`, `showIcon`, `showDate`, `showResponsible`, `compact` |
| `TransactionList` | Container de lista de transações | `itemProps`, `gap`, callbacks |

**Onde será usado:**
- OverdueSection
- SplitTransactionView (colunas desktop)
- TransactionGroup (lista mobile)

---

### 2. FILTROS

| Componente | Uso | Props Configuráveis |
|------------|-----|---------------------|
| `FilterPill` | Botão de filtro individual | `variant`, `selected`, `icon`, `count`, `size` |
| `FilterPillGroup` | Container scrollável de pills | `className` |

**Onde será usado:**
- CategoryTabs (filtro de categorias)
- OverdueSection (Todos/A Pagar/A Receber)
- Stats page (filtro por tipo)

---

### 3. BOTÕES DE AÇÃO

| Componente | Uso | Props Configuráveis |
|------------|-----|---------------------|
| `AddTransactionPopover` | Popover para adicionar transação | `side`, `align`, `showTrigger` |
| `FAB` | Botão flutuante | Reutiliza AddTransactionPopover internamente |

**Onde será usado:**
- BottomNav (mobile)
- Desktop (canto inferior direito)
- SplitTransactionView (botões + nas colunas)

---

### 4. CARDS

| Componente | Uso | Props Configuráveis |
|------------|-----|---------------------|
| `StatCard` | Card de estatística | `title`, `value`, `trend`, `color` |
| `BalanceCard` | Card de saldo | (já existe, revisar) |
| `CollapsibleSection` | Seção colapsável com header | `title`, `icon`, `color`, `count`, `defaultOpen` |

**Onde será usado:**
- MiniStatsCard
- BalanceCard
- OverdueSection
- Qualquer agrupamento

---

### 5. FORMULÁRIOS

| Componente | Uso | Status |
|------------|-----|--------|
| `TransactionSheet` | Modal/Drawer de transação | ✅ Já existe |
| `Field` | Campo de formulário | ✅ Já existe em ui/ |

---

## Arquivos a Modificar

### Fase 1: Componentes Base
1. ✅ `src/components/ui/filter-pill.tsx` - Já criado
2. ✅ `src/components/shared/AddTransactionPopover.tsx` - Já criado
3. ✅ `src/components/shared/TransactionList.tsx` - Já criado

### Fase 2: Refatorar Consumidores
4. `src/components/dashboard/CategoryTabs.tsx` - Usar FilterPill
5. `src/app/dashboard/page.tsx` - OverdueSection usar TransactionList + FilterPill
6. `src/components/dashboard/SplitTransactionView.tsx` - Usar TransactionList
7. `src/components/dashboard/TransactionRowNew.tsx` - Deprecar, usar TransactionList
8. `src/components/layout/BottomNav.tsx` - Usar AddTransactionPopover (já feito)

### Fase 3: Criar Componentes Faltantes
9. `src/components/shared/CollapsibleSection.tsx` - Novo
10. `src/components/shared/StatCard.tsx` - Novo (ou manter MiniStatsCard)

### Fase 4: Limpeza
11. Deletar componentes duplicados/não usados

---

## Arquivos a Deletar (após migração)

| Arquivo | Motivo |
|---------|--------|
| `QuickActions.tsx` | Substituído por FAB |
| `OverdueAlert.tsx` | Substituído por OverdueSection |
| `TransactionTable.tsx` | Substituído por SplitTransactionView |

---

## Verificação

1. `npx tsc --noEmit` - Zero erros
2. Teste visual em mobile e desktop
3. Todos os filtros com mesmo visual
4. Todos os itens de lista com mesmo visual
5. FAB com mesmo popover em mobile e desktop

---

## Priorização

| Prioridade | Componente | Impacto |
|------------|------------|---------|
| P1 | TransactionList + TransactionListItem | Alto - afeta 3 listas |
| P1 | FilterPill + FilterPillGroup | Alto - afeta 2 filtros |
| P1 | AddTransactionPopover | Médio - visual consistente |
| P2 | CollapsibleSection | Médio - organização |
| P3 | StatCard | Baixo - já funciona |
