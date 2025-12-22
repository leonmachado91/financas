# Refatoração UI/UX Responsivo - Lista de Tarefas

> **Objetivo**: Criar experiência desktop profissional unificada com visual mobile

---

## Fase 1: Estrutura de Layout Responsivo ✅

### 1.1 Criar DesktopSidebar
- [x] Criar `src/components/layout/DesktopSidebar.tsx`
  - [x] Estrutura base com nav items (Dashboard, Stats, Settings)
  - [x] Aplicar design tokens modernos (`--bg-secondary`, `--accent-lime`)
  - [x] Logo/Brand no topo
  - [x] Seção de perfil no rodapé
  - [x] Estado collapsed para tablets (icon-only)
  - [x] Transições suaves

### 1.2 Atualizar AppShell
- [x] Modificar `src/components/layout/AppShell.tsx`
  - [x] Importar e renderizar DesktopSidebar
  - [x] Classe `md:ml-64` quando sidebar visível
  - [x] Prop para controlar sidebar expanded/collapsed

### 1.3 Criar hook useMediaQuery
- [x] Verificar se `src/hooks/use-mobile.ts` é suficiente ✅ (já existia)

### 1.4 Atualizar exports
- [x] Atualizar `src/components/layout/index.ts`

---

## Fase 2: Dashboard Desktop ✅

### 2.1 Layout Responsivo do Dashboard
- [x] Modificar `src/app/dashboard/page.tsx`
  - [x] Mobile: manter layout vertical atual
  - [x] Desktop: TransactionTable ao invés de lista agrupada

### 2.2 BalanceCard Responsivo
- [x] `BalanceCardNew.tsx` já funciona bem em ambos os tamanhos

### 2.3 QuickActions Responsivo
- [x] `QuickActions.tsx` já funciona bem em ambos os tamanhos

---

## Fase 3: TransactionTable Desktop ✅

### 3.1 Criar TransactionTable
- [x] Criar `src/components/dashboard/TransactionTable.tsx`
  - [x] Colunas: Checkbox | Descrição | Categoria | Responsável | Data | Valor | Ações
  - [x] Hover actions (edit, delete)
  - [x] Dropdown menu com ações

### 3.2 Integrar no Dashboard
- [x] Modificar `src/app/dashboard/page.tsx`
  - [x] Renderizar `TransactionTable` em `md:` e acima
  - [x] Manter `TransactionGroup` apenas em mobile

---

## Fase 4: Stats e Settings Desktop ✅

### 4.1 Stats Page Responsivo
- [x] Modificar `src/app/stats/page.tsx`
  - [x] Desktop: grid 2 colunas para gráficos

### 4.2 Settings Page Responsivo
- [x] Modificar `src/app/settings/page.tsx`
  - [x] Desktop: grid 2 colunas com max-width

---

## Fase 5: Limpeza e Polimento ✅

### 5.1 Remover Componentes Obsoletos
- [x] Deletar `src/app/dashboard/page-old.tsx`
- [x] Deletar `src/components/dashboard/Header.tsx`
- [x] Deletar `src/components/dashboard/BalanceCard.tsx` (versão antiga)
- [x] Deletar `src/components/dashboard/Sidebar.tsx` (não utilizado)
- [x] Deletar `src/components/dashboard/TransactionList.tsx` (não utilizado)

### 5.2 Tokenização Final
- [x] Adicionar tokens para sidebar width em `tokens.css`

### 5.3 Build de Verificação
- [x] Build passou sem erros

---

## Fase 6: Funcionalidades Pendentes (Pós-Refatoração)

> Estas tarefas serão tratadas em uma próxima sessão

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

## Resumo da Refatoração

### Arquivos Criados
- `src/components/layout/DesktopSidebar.tsx` - Nova sidebar desktop
- `src/components/dashboard/TransactionTable.tsx` - Tabela desktop

### Arquivos Modificados
- `src/components/layout/AppShell.tsx` - Integração sidebar
- `src/components/layout/TopBar.tsx` - Offset para sidebar
- `src/components/layout/index.ts` - Novos exports
- `src/styles/tokens.css` - Tokens de sidebar width
- `src/app/dashboard/page.tsx` - Layout responsivo
- `src/app/stats/page.tsx` - Grid responsivo
- `src/app/settings/page.tsx` - Grid responsivo

### Arquivos Removidos
- `src/app/dashboard/page-old.tsx`
- `src/components/dashboard/Header.tsx`
- `src/components/dashboard/BalanceCard.tsx`
- `src/components/dashboard/Sidebar.tsx`
- `src/components/dashboard/TransactionList.tsx`