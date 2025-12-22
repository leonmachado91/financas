# Refatoração UI/UX Responsivo - Lista de Tarefas

> **Objetivo**: Criar experiência desktop profissional unificada com visual mobile

---

## Fase 1: Estrutura de Layout Responsivo

### 1.1 Criar DesktopSidebar
- [ ] Criar `src/components/layout/DesktopSidebar.tsx`
  - [ ] Estrutura base com nav items (Dashboard, Stats, Settings)
  - [ ] Aplicar design tokens modernos (`--bg-secondary`, `--accent-lime`)
  - [ ] Logo/Brand no topo
  - [ ] Seção de perfil no rodapé
  - [ ] Estado collapsed para tablets (icon-only)
  - [ ] Transições suaves

### 1.2 Atualizar AppShell
- [ ] Modificar `src/components/layout/AppShell.tsx`
  - [ ] Importar e renderizar DesktopSidebar
  - [ ] Classe `md:pl-64` quando sidebar visível
  - [ ] Prop para controlar sidebar expanded/collapsed

### 1.3 Criar hook useMediaQuery
- [ ] Verificar se `src/hooks/use-mobile.ts` é suficiente
- [ ] Se não, criar hook genérico para breakpoints

### 1.4 Atualizar exports
- [ ] Atualizar `src/components/layout/index.ts`

---

## Fase 2: Dashboard Desktop

### 2.1 Layout Responsivo do Dashboard
- [ ] Modificar `src/app/dashboard/page.tsx`
  - [ ] Mobile: manter layout vertical atual
  - [ ] Desktop: criar grid 2 colunas (main + side)
  - [ ] Collapsible sidebar de atalhos

### 2.2 BalanceCard Responsivo
- [ ] Ajustar `src/components/dashboard/BalanceCardNew.tsx`
  - [ ] Tamanho menor em desktop quando em grid
  - [ ] Ou criar variante compacta

### 2.3 QuickActions Responsivo
- [ ] Ajustar `src/components/dashboard/QuickActions.tsx`
  - [ ] Layout horizontal em desktop
  - [ ] Ícones maiores com labels

---

## Fase 3: TransactionTable Desktop

### 3.1 Criar TransactionTable
- [ ] Criar `src/components/dashboard/TransactionTable.tsx`
  - [ ] Colunas: Checkbox | Descrição | Categoria | Responsável | Data | Valor | Ações
  - [ ] Hover actions (edit, delete)
  - [ ] Sorting por coluna
  - [ ] Zebra striping ou divisors

### 3.2 Integrar no Dashboard
- [ ] Modificar `src/app/dashboard/page.tsx`
  - [ ] Renderizar `TransactionTable` em `md:` e acima
  - [ ] Manter `TransactionGroup` apenas em mobile

### 3.3 Adaptar TransactionSheet para Desktop
- [ ] Modificar/criar `src/components/transaction/TransactionDialog.tsx`
  - [ ] Desktop: usar Dialog ao invés de Drawer
  - [ ] Mobile: manter Drawer atual
  - [ ] Componente wrapper que escolhe baseado em breakpoint

---

## Fase 4: Stats e Settings Desktop

### 4.1 Stats Page Responsivo
- [ ] Modificar `src/app/stats/page.tsx`
  - [ ] Desktop: grid 2 colunas para gráficos
  - [ ] Cards de resumo em row horizontal
  - [ ] Donut maior em desktop

### 4.2 Settings Page Responsivo
- [ ] Modificar `src/app/settings/page.tsx`
  - [ ] Desktop: layout com cards em grid
  - [ ] Seções visualmente separadas
  - [ ] Breadcrumb navigation

---

## Fase 5: Limpeza e Polimento

### 5.1 Remover Componentes Obsoletos
- [ ] Deletar `src/app/dashboard/page-old.tsx`
- [ ] Deletar `src/components/dashboard/Header.tsx`
- [ ] Deletar `src/components/dashboard/BalanceCard.tsx` (versão antiga)
- [ ] Revisar se `MonthSelector.tsx` ainda é usado

### 5.2 Consolidar Sidebar
- [ ] Avaliar se manter `src/components/dashboard/Sidebar.tsx`
- [ ] Ou migrar funcionalidade para DesktopSidebar

### 5.3 Tokenização Final
- [ ] Revisar `src/styles/tokens.css`
  - [ ] Adicionar tokens para sidebar width
  - [ ] Tokens para breakpoints se necessário

### 5.4 Testes Visuais
- [ ] Testar em viewport 375px (mobile small)
- [ ] Testar em viewport 768px (tablet)
- [ ] Testar em viewport 1024px (desktop small)
- [ ] Testar em viewport 1440px (desktop large)
- [ ] Testar transições de breakpoint

---

## Fase 6: Funcionalidades Pendentes (Pós-Refatoração)

> Estas tarefas serão tratadas após a refatoração de UI

### 6.1 Dados Reais - Stats
- [ ] Implementar query para buscar dados de múltiplos meses
- [ ] Substituir `Math.random()` por dados reais
- [ ] Comparação real com período anterior

### 6.2 Settings Funcionais
- [ ] Criar página/modal de Gerenciar Categorias
- [ ] Criar página/modal de Gerenciar Métodos de Pagamento
- [ ] CRUD completo para ambos

### 6.3 Autenticação
- [ ] Implementar logout funcional
- [ ] Revisar fluxo de autenticação

### 6.4 Métodos de Pagamento no Form
- [ ] Buscar métodos de pagamento do DB
- [ ] Popular select no TransactionSheet

### 6.5 Notificações
- [ ] Definir escopo de notificações
- [ ] Implementar sistema básico

---

## Notas para Implementação

### Ordem de Execução
Execute as fases em ordem. Cada fase depende da anterior.

### Commits Sugeridos
- `feat(layout): add DesktopSidebar component`
- `feat(layout): integrate responsive sidebar in AppShell`
- `feat(dashboard): add desktop grid layout`
- `feat(dashboard): add TransactionTable component`
- `feat(stats): add responsive grid layout`
- `feat(settings): add responsive card layout`
- `chore: remove obsolete components`
- `style: final polish and token adjustments`

### Testes Prioritários
1. Navegação sidebar ↔ bottomnav
2. Adicionar transação em ambos os modos
3. Listar transações (lista vs tabela)
4. Responsividade dos gráficos