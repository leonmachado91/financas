# Log 005 - Componentização e Padronização Visual Completa

**Data:** 2025-12-24  
**Sessão:** Componentização completa do aplicativo Finanças

---

## Resumo Cronológico

### 1. Identificação de Problemas Visuais

O usuário identificou inconsistências visuais graves no dashboard:
- Filtros de "Atrasados" e "Categorias" com estilos diferentes
- Itens de transação com layouts distintos entre seções
- FAB (Floating Action Button) com popovers visuais diferentes em mobile vs desktop
- Cores hardcoded em vez de variáveis CSS

### 2. Tentativa Inicial de Padronização (Incompleta)

Primeira tentativa de padronização focou apenas em CSS inline, sem criar componentes reutilizáveis. O usuário criticou a abordagem por não resolver o problema estrutural.

### 3. Proposta de Componentização Completa

Criação de proposta abrangente (`spec/proposal.md`) identificando todos os componentes que precisavam ser unificados:
- Listas e tabelas → `TransactionListItem`, `TransactionList`
- Filtros → `FilterPill`, `FilterPillGroup`
- Ações → `AddTransactionPopover`
- Seções → `CollapsibleSection`

### 4. Implementação dos Componentes Base (Fase 1)

**Componentes criados:**
- `FilterPill` e `FilterPillGroup` - Botões de filtro padronizados com variants (default, success, danger, warning, lime)
- `AddTransactionPopover` - Popover unificado para adicionar transações
- `TransactionListItem` e `TransactionList` - Componentes configuráveis para listas de transações

### 5. Refatoração dos Consumidores (Fase 2)

**Arquivos refatorados:**
- `CategoryTabs.tsx` → usa `FilterPill`
- `OverdueSection` (em `dashboard/page.tsx`) → usa `TransactionList` + `FilterPill`
- `SplitTransactionView.tsx` → usa `TransactionList` com props configuráveis

### 6. Unificação do FAB (Fase 3)

- `BottomNav.tsx` já usava `AddTransactionPopover`
- FAB funciona tanto em mobile quanto desktop com mesmo visual
- `FloatingFAB.tsx` já havia sido deletado anteriormente

### 7. Criação de Componentes Adicionais (Fase 4)

- `CollapsibleSection` - Seção expansível reutilizável com variants de cor

### 8. Limpeza de Arquivos Obsoletos (Fase 5)

**Arquivos deletados:**
- `TransactionTable.tsx` - substituído por `SplitTransactionView`
- `FloatingFAB.tsx` - funcionalidade movida para `BottomNav`
- `QuickActions.tsx` - substituído por FAB
- `OverdueAlert.tsx` - substituído por `OverdueSection`

### 9. Verificação Final

- TypeScript compila sem erros ✅
- Verificação visual via browser confirmou consistência entre seções

---

## Arquivos de Código Criados/Modificados

### Novos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/components/shared/TransactionList.tsx` | Componentes `TransactionListItem` e `TransactionList` |
| `src/components/shared/CollapsibleSection.tsx` | Seção expansível reutilizável |
| `src/components/ui/filter-pill.tsx` | Componentes `FilterPill` e `FilterPillGroup` |
| `src/components/shared/AddTransactionPopover.tsx` | Popover para adicionar transações |

### Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `src/components/dashboard/CategoryTabs.tsx` | Refatorado para usar `FilterPill` |
| `src/components/dashboard/SplitTransactionView.tsx` | Refatorado para usar `TransactionList` |
| `src/components/layout/BottomNav.tsx` | Usa `AddTransactionPopover` para mobile e desktop |
| `src/app/dashboard/page.tsx` | `OverdueSection` refatorado para usar `TransactionList` + `FilterPill` |
| `src/styles/tokens.css` | Adicionados tokens de warning e pill sizing |

### Arquivos Deletados

| Arquivo | Motivo |
|---------|--------|
| `src/components/layout/FloatingFAB.tsx` | Funcionalidade movida para BottomNav |
| `src/components/dashboard/QuickActions.tsx` | Substituído por FAB |
| `src/components/dashboard/OverdueAlert.tsx` | Substituído por OverdueSection |
| `src/components/dashboard/TransactionTable.tsx` | Substituído por SplitTransactionView |

---

## Componentes Reutilizáveis Finais

| Componente | Props Configuráveis |
|------------|---------------------|
| `TransactionListItem` | `showCheckbox`, `showIcon`, `showDate`, `showResponsible`, `showMenu`, `compact` |
| `TransactionList` | `itemProps`, `gap`, callbacks |
| `FilterPill` | `variant`, `selected`, `icon`, `count`, `size` |
| `FilterPillGroup` | `className` |
| `AddTransactionPopover` | `side`, `align` |
| `CollapsibleSection` | `title`, `icon`, `color`, `count`, `defaultOpen`, `variant` |
