# Refatoração UI/UX Responsivo - Desktop + Mobile

## Contexto

O app Finanças passou por uma refatoração mobile-first que deixou a versão desktop ineficiente. 
A versão atual exibe o layout mobile esticado em telas grandes, sem aproveitar o espaço horizontal.

### Problema Identificado
- **Mobile atual**: Visual moderno com design tokens corretos, swipe gestures, BottomNav
- **Desktop antigo**: Layout com Sidebar + Grid, mas visual desatualizado (cores e estilos diferentes)
- **Desktop atual**: Inexistente - apenas mobile esticado

---

## Objetivo

Criar uma experiência **unificada e profissional** para ambas as plataformas:
1. Manter o visual moderno da versão mobile como base
2. Adaptar layout para desktop com melhor aproveitamento de espaço
3. Unificar componentes para usar os mesmos design tokens
4. Identificar funcionalidades incompletas para implementação posterior

---

## Inventário de Componentes

### ✅ Componentes Mobile Modernos (MANTER)
| Componente | Status | Descrição |
|------------|--------|-----------|
| `TopBar.tsx` | ✅ Bom | Header compacto com perfil e blur |
| `BottomNav.tsx` | ✅ Mobile only | Navegação inferior com FAB |
| `BalanceCardNew.tsx` | ✅ Bom | Card hero com month picker integrado |
| `TransactionRowNew.tsx` | ✅ Bom | Linha com ícones, swipe gestures |
| `QuickActions.tsx` | ✅ Bom | Botões receita/despesa |
| `CategoryGrid.tsx` | ✅ Bom | Grid de filtros por categoria |
| `TransactionSheet.tsx` | ✅ Bom | Bottom sheet para add/edit |
| `EmptyState.tsx` | ✅ Bom | Estados vazios animados |

### ⚠️ Componentes Desktop Antigos (ADAPTAR OU SUBSTITUIR)
| Componente | Status | Ação |
|------------|--------|------|
| `Sidebar.tsx` (dashboard) | ⚠️ Visual antigo | Atualizar visual para novos tokens |
| `Header.tsx` | ❌ Obsoleto | Remover - usar TopBar |
| `BalanceCard.tsx` | ❌ Obsoleto | Remover - usar BalanceCardNew |
| `TransactionList.tsx` | ⚠️ Funcional | Atualizar visual ou criar versão desktop |
| `MonthSelector.tsx` | ⚠️ Híbrido | Já tem adaptações md:, avaliar uso |
| `page-old.tsx` | 📦 Backup | Referência de layout desktop |

### 📦 Componentes UI Shadcn (DISPONÍVEIS)
| Componente | Uso |
|------------|-----|
| `sidebar.tsx` (ui) | Sistema completo de sidebar shadcn |
| `sheet.tsx` | Para menus mobile |
| `dialog.tsx` | Para modais desktop |

---

## Arquitetura Proposta

### Layout Master Responsivo

```
┌─────────────────────────────────────────────────────────────┐
│                        TopBar (fixo)                        │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│          │                                                   │
│ Sidebar  │              Main Content                         │
│ (desktop │                                                   │
│  only)   │   ┌─────────────────┐ ┌─────────────────┐        │
│          │   │  BalanceCard    │ │   Stats Card    │        │
│   w-64   │   └─────────────────┘ └─────────────────┘        │
│          │                                                   │
│          │   ┌─────────────────────────────────────┐        │
│          │   │        Transactions Table           │        │
│          │   │        (desktop only)               │        │
│          │   └─────────────────────────────────────┘        │
│          │                                                   │
├──────────┴──────────────────────────────────────────────────┤
│                    BottomNav (mobile only)                   │
└─────────────────────────────────────────────────────────────┘
```

### Breakpoints
- `< 768px (mobile)`: BottomNav + Layout vertical
- `>= 768px (md)`: Sidebar + Layout horizontal
- `>= 1280px (xl)`: Sidebar expandida + Grid 2-3 colunas

---

## Mudanças Propostas

### 1. Layout Container (`AppShell`)
**Arquivo**: `src/components/layout/AppShell.tsx`

Adicionar lógica para:
- Detectar breakpoint
- Renderizar Sidebar em desktop
- Ajustar padding-left quando Sidebar visível

### 2. Nova Sidebar Desktop
**Arquivo**: `src/components/layout/DesktopSidebar.tsx` (NOVO)

Criar sidebar moderna com:
- Visual alinhado aos novos tokens (--bg-secondary, --accent-lime)
- Links: Dashboard, Estatísticas, Configurações
- Logo/Branding no topo
- Perfil/Logout no rodapé
- Animação de collapse (icon-only mode)

### 3. Dashboard Page Responsivo
**Arquivo**: `src/app/dashboard/page.tsx`

Alterar layout para:
- Mobile: Layout atual (vertical)
- Desktop: Grid com sidebar + conteúdo em colunas
- Transações em tabela (desktop) vs lista (mobile)

### 4. Componente TransactionTable (NOVO)
**Arquivo**: `src/components/dashboard/TransactionTable.tsx`

Criar versão tabular para desktop com:
- Colunas: Status | Descrição | Categoria | Responsável | Data | Valor | Ações
- Hover actions (edit/delete)
- Sorting e filtros inline
- Mesmos tokens visuais

### 5. Stats Page Responsivo
**Arquivo**: `src/app/stats/page.tsx`

Alterar layout para:
- Mobile: Layout atual (vertical)
- Desktop: Grid 2 colunas (gráficos lado a lado)

### 6. Settings Page Responsivo
**Arquivo**: `src/app/settings/page.tsx`

Alterar layout para:
- Mobile: Lista vertical
- Desktop: Grid com seções em cards

---

## Funcionalidades Incompletas Identificadas

### 🔴 Alta Prioridade
| Funcionalidade | Arquivo | Problema |
|----------------|---------|----------|
| Estatísticas de evolução | `stats/page.tsx` | Usa dados MOCK (`Math.random()`) |
| Comparação período anterior | `stats/page.tsx` | Usa dados MOCK |
| Métodos de pagamento | `TransactionSheet.tsx` | Lista vazia (não busca do DB) |
| Gerenciar categorias | `settings/page.tsx` | Links não funcionam |
| Gerenciar métodos pagamento | `settings/page.tsx` | Links não funcionam |
| Logout | `TopBar.tsx` / `Sidebar.tsx` | Botão não implementado |
| Notificações | `TopBar.tsx` | Badge fake, sem funcionalidade |

### 🟡 Média Prioridade
| Funcionalidade | Arquivo | Problema |
|----------------|---------|----------|
| Definir meta | `QuickActions.tsx` | Callback existe mas sem implementação |
| Filtro por perfil | N/A | Não existe, apenas visual no TopBar |
| Toggle período anual | `stats/page.tsx` | Botão existe mas não altera dados |
| Excluir transação confirmação | `page.tsx` | Não há ConfirmDialog integrado |

### 🟢 Baixa Prioridade
| Funcionalidade | Arquivo | Problema |
|----------------|---------|----------|
| Tema claro | `globals.css` | Definido mas não há toggle |
| Exportar dados | N/A | Não implementado |
| Histórico/Backup | N/A | Não implementado |

---

## Arquivos a Criar/Modificar

### Novos Arquivos
1. `src/components/layout/DesktopSidebar.tsx` - Sidebar moderna desktop
2. `src/components/dashboard/TransactionTable.tsx` - Tabela desktop
3. `src/hooks/useMediaQuery.ts` - Hook para detectar breakpoints (se não existir)

### Arquivos a Modificar
1. `src/components/layout/AppShell.tsx` - Integrar sidebar
2. `src/components/layout/index.ts` - Exportar novos componentes
3. `src/app/dashboard/page.tsx` - Layout responsivo
4. `src/app/stats/page.tsx` - Layout responsivo
5. `src/app/settings/page.tsx` - Layout responsivo
6. `src/styles/tokens.css` - Tokens de sidebar

### Arquivos a Remover (Limpeza)
1. `src/app/dashboard/page-old.tsx` - Backup obsoleto
2. `src/components/dashboard/Header.tsx` - Substituído por TopBar
3. `src/components/dashboard/BalanceCard.tsx` - Substituído por BalanceCardNew

---

## Plano de Verificação

### Testes Visuais
- [ ] Mobile (< 768px): BottomNav visível, Sidebar oculta
- [ ] Tablet (768px-1024px): Sidebar collapsed, layout adaptado
- [ ] Desktop (> 1024px): Sidebar expandida, grid columns
- [ ] Dark mode consistente em todos os breakpoints

### Testes Funcionais
- [ ] Navegação entre páginas via Sidebar (desktop)
- [ ] Navegação entre páginas via BottomNav (mobile)
- [ ] Adicionar transação funciona em ambos
- [ ] Editar transação funciona em ambos
- [ ] Excluir transação funciona em ambos
- [ ] Swipe gestures apenas em mobile

---

## Próximos Passos

Após aprovação desta proposta:
1. **Fase 1**: Criar estrutura de layout responsivo (AppShell + DesktopSidebar)
2. **Fase 2**: Adaptar Dashboard para desktop
3. **Fase 3**: Criar TransactionTable para desktop
4. **Fase 4**: Adaptar Stats e Settings
5. **Fase 5**: Limpeza de componentes obsoletos
6. **Fase 6**: Implementar funcionalidades faltantes (separadamente)
