# Tasks: Componentização Completa

## Fase 1: Componentes Base ✅
- [x] **1.1** Criar `FilterPill` e `FilterPillGroup`
- [x] **1.2** Criar `AddTransactionPopover`
- [x] **1.3** Criar `TransactionListItem` e `TransactionList`

## Fase 2: Refatorar Consumidores ✅
- [x] **2.1** Refatorar `CategoryTabs` para usar `FilterPill`
- [x] **2.2** Refatorar `OverdueSection` para usar `TransactionList` + `FilterPill`
- [x] **2.3** Refatorar `SplitTransactionView` para usar `TransactionList`
- [x] **2.4** Refatorar listas mobile para usar `TransactionList` (já usa TransactionGroup)

## Fase 3: Unificar FAB ✅
- [x] **3.1** `BottomNav` usa `AddTransactionPopover` (mobile + desktop)
- [x] **3.2** `FloatingFAB` removido

## Fase 4: Criar Componentes Faltantes ✅
- [x] **4.1** Criar `CollapsibleSection` reutilizável
- [x] **4.2** `MiniStatsCard` mantido (funciona bem)

## Fase 5: Limpeza ✅
- [x] **5.1** `QuickActions.tsx` já removido
- [x] **5.2** `OverdueAlert.tsx` já removido
- [x] **5.3** `TransactionTable.tsx` removido
- [x] **5.4** `FloatingFAB.tsx` removido

## Verificação ✅
- [x] `npx tsc --noEmit` sem erros
- [ ] Teste visual mobile
- [ ] Teste visual desktop
- [ ] FAB com mesmo visual em ambos
- [ ] Filtros com mesmo visual
- [ ] Itens de lista com mesmo visual

---

## Componentes Criados

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| `TransactionListItem` | `src/components/shared/TransactionList.tsx` | Item de lista configurável |
| `TransactionList` | `src/components/shared/TransactionList.tsx` | Container de lista |
| `FilterPill` | `src/components/ui/filter-pill.tsx` | Botão de filtro |
| `FilterPillGroup` | `src/components/ui/filter-pill.tsx` | Container de filtros |
| `AddTransactionPopover` | `src/components/shared/AddTransactionPopover.tsx` | Popover de adicionar |
| `CollapsibleSection` | `src/components/shared/CollapsibleSection.tsx` | Seção expansível |

## Arquivos Refatorados

| Arquivo | Mudança |
|---------|---------|
| `CategoryTabs.tsx` | Usa `FilterPill` |
| `SplitTransactionView.tsx` | Usa `TransactionList` |
| `BottomNav.tsx` | Usa `AddTransactionPopover` |
| `dashboard/page.tsx` | `OverdueSection` usa `TransactionList` + `FilterPill` |

## Arquivos Deletados

- `FloatingFAB.tsx`
- `QuickActions.tsx`
- `OverdueAlert.tsx`
- `TransactionTable.tsx`