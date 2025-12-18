# Proposta de Finalização - App Finanças

## Resumo

Esta proposta detalha as tarefas restantes para concluir o MVP do aplicativo Finanças, conforme o roadmap original e a especificação funcional. O objetivo é polir a interface, adicionar funcionalidades menores faltantes, e preparar para deploy.

---

## Itens Pendentes do Roadmap

| Fase | Item | Status |
|------|------|--------|
| 2.5 | Páginas de Gerenciamento | Parcial* |
| 3.1 | Revisão Visual | Pendente |
| 3.2 | Empty States e Loading | Pendente |
| 3.3 | Responsividade Mobile | Pendente |
| 4.x | Testes e Correções | Pendente |
| 5.x | Deploy | Pendente |

*\*Categorias e Formas de Pagamento existem no SettingsDialog, mas não como páginas dedicadas.*

---

## Propostas de Mudança

### Fase 1: Polimento de UI/UX

#### 1.1 Empty States

Adicionar mensagens amigáveis quando listas estão vazias.

##### [MODIFY] [TransactionList.tsx](file:///e:/Andamento/Webapps/Finanças/src/components/dashboard/TransactionList.tsx)

- Quando `items.length === 0`, exibir mensagem contextual:
  - Receitas: "Nenhuma receita registrada este mês"
  - Despesas: "Nenhuma despesa registrada este mês"
  - Atrasados: "🎉 Nenhuma pendência! Tudo em dia."

#### 1.2 Exibir Responsável na Lista

O campo `profile` existe mas não é exibido na `TransactionList`.

##### [MODIFY] [TransactionList.tsx](file:///e:/Andamento/Webapps/Finanças/src/components/dashboard/TransactionList.tsx)

- Adicionar campo `profileName` na interface `TransactionItem`
- Exibir badge com nome do responsável (Leonardo/Flávia) ao lado da categoria

##### [MODIFY] [page.tsx](file:///e:/Andamento/Webapps/Finanças/src/app/dashboard/page.tsx)

- Atualizar `mapToItem` para incluir `profileName` da transação

#### 1.3 Campo "Pago" no Formulário

Permitir criar transações já pagas (útil para lançamentos retroativos).

##### [MODIFY] [AddTransactionDialog.tsx](file:///e:/Andamento/Webapps/Finanças/src/components/dashboard/AddTransactionDialog.tsx)

- Adicionar checkbox "Já foi paga" no formulário
- Atualizar schema e serviço para enviar `status: 'paid'`

##### [MODIFY] [EditTransactionDialog.tsx](file:///e:/Andamento/Webapps/Finanças/src/components/dashboard/EditTransactionDialog.tsx)

- Adicionar checkbox "Paga" para edição

---

### Fase 2: Responsividade Mobile

#### 2.1 Sidebar Colapsável

##### [MODIFY] [Sidebar.tsx](file:///e:/Andamento/Webapps/Finanças/src/components/dashboard/Sidebar.tsx)

- Em telas pequenas (`md:hidden`): ocultar sidebar e mostrar botão hambúrguer
- Usar Sheet do shadcn/ui para sidebar mobile

#### 2.2 Layout do Dashboard

##### [MODIFY] [page.tsx](file:///e:/Andamento/Webapps/Finanças/src/app/dashboard/page.tsx)

- BalanceCard: `grid-cols-1` em mobile, `grid-cols-3` em desktop
- TransactionLists: `flex-col` em mobile, lado a lado em desktop

#### 2.3 Seletor de Mês

##### [MODIFY] [MonthSelector.tsx](file:///e:/Andamento/Webapps/Finanças/src/components/dashboard/MonthSelector.tsx)

- Scroll horizontal com snap em mobile
- Botões de seta para navegação

---

### Fase 3: Páginas de Gerenciamento (Opcional)

> ⚠️ **Nota:** Esta fase é opcional pois o gerenciamento já existe no SettingsDialog. Páginas dedicadas podem ser implementadas futuramente se necessário.

#### 3.1 Página de Categorias

##### [NEW] [categories/page.tsx](file:///e:/Andamento/Webapps/Finanças/src/app/categories/page.tsx)

- Tabela com todas as categorias
- Botões de editar e excluir em cada linha
- Formulário de adicionar

#### 3.2 Página de Formas de Pagamento

##### [NEW] [payment-methods/page.tsx](file:///e:/Andamento/Webapps/Finanças/src/app/payment-methods/page.tsx)

- Similar à página de categorias

---

### Fase 4: Testes e Correções

#### 4.1 Testes Manuais

Verificar os seguintes fluxos:

| # | Fluxo | Passos |
|---|-------|--------|
| 1 | Criar transação | Abrir dialog → Preencher → Salvar → Verificar na lista |
| 2 | Editar transação | Clicar lápis → Alterar → Salvar → Verificar alteração |
| 3 | Excluir transação | Clicar lixeira → Confirmar → Verificar remoção |
| 4 | Marcar como paga | Clicar checkbox → Verificar visual + atrasados |
| 5 | Mudar mês | Clicar em outro mês → Verificar filtro |
| 6 | Trocar perfil | Clicar no header → Verificar pré-preenchimento |
| 7 | Gerenciar categorias | Abrir Settings → Adicionar/Excluir categoria |
| 8 | Gerenciar pagamentos | Abrir Settings → Adicionar/Excluir forma |

#### 4.2 Correção de Bugs

- Corrigir qualquer bug identificado nos testes

---

### Fase 5: Deploy

#### 5.1 Preparação

- Verificar variáveis de ambiente de produção
- Configurar Supabase produção (se diferente de desenvolvimento)

#### 5.2 Vercel

##### Configuração

1. Conectar repositório ao Vercel
2. Adicionar variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Deploy automático

#### 5.3 Validação

- Testar todos os fluxos em produção

---

## Priorização

| Fase | Descrição | Esforço | Prioridade |
|------|-----------|---------|------------|
| 1.1 | Empty States | 30min | Alta |
| 1.2 | Exibir Responsável | 30min | Média |
| 1.3 | Campo Pago no Form | 30min | Média |
| 2.x | Responsividade | 2h | Média |
| 3.x | Páginas Gerenciamento | 2h | Baixa |
| 4.x | Testes | 1h | Alta |
| 5.x | Deploy | 30min | Alta |
| **Total** | | **~7h** | |

---

## Recomendação

1. **Prioridade Imediata:** Empty states + Testes manuais
2. **Pode esperar:** Responsividade mobile, páginas dedicadas
3. **Quando pronto:** Deploy

---

## Fora do Escopo

- Sistema de autenticação
- Relatórios e gráficos
- Aplicativo móvel nativo
- Notificações push
