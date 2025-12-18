# Roadmap de Desenvolvimento - Finanças

Este documento descreve o roteiro completo para o desenvolvimento do aplicativo **Finanças**, desde a configuração inicial até o deploy final. O objetivo é garantir que todas as etapas estejam alinhadas com o [Guia de Arquitetura](spec/Guia%20de%20Arquitetura%20e%20Workflow%20de%20Desenvolvimento%20%202ad12cc54f5880cc8aa5eb19ee214b42.md) e a [Visão Geral do Projeto](spec/brief/00_PROJECT_OVERVIEW.md).

## Fase 0: Setup e Configuração Inicial
**Objetivo:** Preparar o ambiente de desenvolvimento e a infraestrutura básica.

- [x] **0.1. Instalação de Dependências:** Instalar pacotes listados no `package.json` (Next.js, Supabase, Tailwind, shadcn/ui, etc.).
- [x] **0.2. Configuração do Supabase (Local):**
    - [x] Inicializar Supabase CLI.
    - [x] Configurar variáveis de ambiente (`.env.local`).
    - [x] Definir esquema inicial do banco de dados (tabelas: `transactions`, `categories`, `payment_methods`).
- [x] **0.3. Estrutura de Diretórios:**
    - [x] Reorganizar `src/` conforme a proposta (criar `features/`, `services/`, `types/`).
    - [x] Limpar arquivos de exemplo do template.

## Fase 1: Arquitetura e Base
**Objetivo:** Estabelecer os fundamentos da aplicação.

- [x] **1.1. Definição de Tipos (TypeScript):**
    - [x] Criar interfaces para `Transaction`, `Category`, `PaymentMethod`.
    - [x] Definir tipos para o estado global (`AppState`).
- [x] **1.2. Serviços de Dados (Supabase):**
    - [x] Implementar `supabaseClient.ts`.
    - [x] Criar serviços CRUD básicos: `transactionsService`, `categoriesService`, `paymentMethodsService`.
- [x] **1.3. Componentes Base (UI):**
    - [x] Configurar tema (cores, fontes) no `tailwind.config.ts`.
    - [x] Instalar/Criar componentes shadcn/ui necessários (Button, Card, Input, Dialog, Select, etc.).
- [x] **1.4. Layout Principal:**
    - [x] Implementar `Sidebar` (navegação).
    - [x] Implementar `Header` (seletor de perfil Leonardo/Flávia).
    - [x] Criar layout responsivo base.

## Fase 2: Implementação de Funcionalidades (MVP)
**Objetivo:** Construir as telas e a lógica de negócio.

- [x] **2.1. Dashboard - Seletor de Mês:**
    - [x] Componente `MonthSelector` (cards dos meses).
    - [x] Lógica de seleção e filtro por mês (Integração).
- [x] **2.2. Dashboard - Resumo Financeiro:**
    - [x] Cards de Balanço (Receitas, Despesas, Saldo) (UI).
    - [x] Card de "Pagamentos Atrasados" (alerta) (UI).
    - [x] Integração com dados reais.
- [x] **2.3. Dashboard - Listagem de Transações:**
    - [x] Listas de Receitas e Despesas (UI).
    - [x] Checkbox para marcar como "Paga" (UI).
    - [x] Integração com dados reais.
- [x] **2.4. Gerenciamento de Transações (CRUD):**
    - [x] Formulário de Adicionar/Editar Transação (UI).
    - [x] Validação de campos (zod + react-hook-form).
    - [x] Integração com `transactionsService`.
- [ ] **2.5. Cadastros Auxiliares:**
    - [ ] Página de Gerenciar Categorias.
    - [ ] Página de Gerenciar Formas de Pagamento.

## Fase 3: Refinamento e UI/UX
**Objetivo:** Polir a interface e garantir a fidelidade ao design.

- [ ] **3.1. Revisão Visual:** Ajustar espaçamentos, cores e tipografia conforme o design fornecido pelo usuário.
- [ ] **3.2. Feedback Visual:** Adicionar toasts de sucesso/erro, estados de loading e empty states.
- [ ] **3.3. Responsividade:** Garantir que o layout funcione bem em desktop e mobile.

## Fase 4: Testes e Validação
**Objetivo:** Garantir a estabilidade e correção dos dados.

- [ ] **4.1. Testes Manuais:** Verificar fluxos críticos (criar transação, mudar mês, trocar perfil).
- [ ] **4.2. Correção de Bugs:** Resolver problemas identificados.

## Fase 5: Deploy
**Objetivo:** Colocar a aplicação no ar.

- [ ] **5.1. Configuração Vercel:** Conectar repositório e configurar variáveis de ambiente de produção.
- [ ] **5.2. Deploy Supabase:** Aplicar migrações no banco de dados de produção.
- [ ] **5.3. Validação Final:** Teste em produção.
