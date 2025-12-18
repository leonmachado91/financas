# Tarefas - Finalização do App Finanças

## Fase 1: Polimento de UI/UX

### 1.1 Empty States
- [x] Adicionar empty state em `TransactionList.tsx` quando `items.length === 0`
- [x] Mensagem para Receitas: "Nenhuma receita registrada este mês"
- [x] Mensagem para Despesas: "Nenhuma despesa registrada este mês"
- [x] Mensagem para Atrasados: "🎉 Nenhuma pendência! Tudo em dia."

### 1.2 Exibir Responsável na Lista
- [x] Adicionar `profileName` na interface `TransactionItem`
- [x] Atualizar `mapToItem` em `page.tsx` para incluir `profileName`
- [x] Exibir badge com responsável na `TransactionList`

### 1.3 Campo "Pago" no Formulário
- [x] Adicionar checkbox "Já foi paga" em `AddTransactionDialog.tsx`
- [x] Adicionar campo `status` no schema Zod
- [x] Atualizar `handleAddTransaction` para enviar status
- [x] Adicionar checkbox "Paga" em `EditTransactionDialog.tsx`

---

## Fase 2: Responsividade Mobile

### 2.1 Sidebar Colapsável
- [x] Ocultar sidebar em mobile (`hidden md:flex`)
- [x] Adicionar botão hambúrguer no header mobile
- [x] Implementar Sheet (shadcn/ui) para navegação mobile

### 2.2 Layout do Dashboard
- [x] BalanceCard: `grid-cols-1 md:grid-cols-3`
- [x] TransactionLists: `flex-col md:grid-cols-2`
- [x] Ajustar padding e espaçamentos para mobile

### 2.3 Seletor de Mês
- [x] Adicionar scroll horizontal com snap
- [x] Testar navegação em touch devices

---

## Fase 3: Páginas de Gerenciamento (Opcional)

### 3.1 Página de Categorias
- [ ] Criar `src/app/categories/page.tsx`
- [ ] Implementar tabela com categorias
- [ ] Adicionar ações de editar/excluir
- [ ] Adicionar link na Sidebar

### 3.2 Página de Formas de Pagamento
- [ ] Criar `src/app/payment-methods/page.tsx`
- [ ] Implementar tabela com formas de pagamento
- [ ] Adicionar ações de editar/excluir
- [ ] Adicionar link na Sidebar

---

## Fase 4: Testes e Correções

### 4.1 Testes Manuais
> ✅ Verificado via browser subagent em 2025-12-18

- [x] Testar: Criar transação (receita e despesa)
- [x] Testar: Editar transação
- [x] Testar: Excluir transação
- [x] Testar: Marcar como paga
- [x] Testar: Mudar mês no seletor
- [x] Testar: Trocar perfil no header
- [x] Testar: Gerenciar categorias (adicionar/excluir)
- [x] Testar: Gerenciar formas de pagamento (adicionar/excluir)
- [x] Testar: Filtro de atrasados (Dívidas/Pagamentos)

### 4.2 Correção de Bugs
- [x] Documentar bugs encontrados - Nenhum bug crítico identificado
- [x] Corrigir bugs identificados - N/A
- [x] Re-testar fluxos corrigidos - N/A

---

## Fase 5: Deploy

### 5.1 Preparação
- [/] Verificar `.env.production` ou variáveis do Vercel
- [/] Confirmar URL do Supabase de produção
- [x] Build local: `pnpm build` sem erros

### 5.2 Deploy Vercel
- [ ] Conectar repositório ao Vercel
- [ ] Configurar variáveis de ambiente
- [ ] Executar primeiro deploy
- [ ] Verificar URL de produção

### 5.3 Validação em Produção
- [ ] Testar fluxo completo em produção
- [ ] Verificar conexão com Supabase
- [ ] Confirmar dados persistindo corretamente

---

## Verificação Final

- [x] Todas as funcionalidades do brief implementadas
- [x] Empty states exibindo corretamente
- [x] Responsável exibido na lista
- [x] Build passando sem erros
- [ ] Deploy concluído e funcional