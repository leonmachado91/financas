# 01 - Histórias de Usuário (User Stories)

## 1. Introdução

Este documento traduz as funcionalidades do projeto "Finanças" em Histórias de Usuário (User Stories). Cada história representa uma pequena funcionalidade contada da perspectiva do usuário final, focando no "quem", no "o quê" e no "porquê". Isso orienta a equipe de desenvolvimento a construir funcionalidades que entregam valor real, centradas nas necessidades e objetivos de Leonardo e Flávia.

## 2. Personas / Usuários

*   **Persona:** Gestor Financeiro do Lar
*   **Nome dos Usuários:** Leonardo, Flávia
*   **Objetivo:** Gerenciar as finanças do casal de forma colaborativa, ágil e descomplicada. Eles precisam de uma visão clara do fluxo de caixa mensal, saber o que está pendente e tomar decisões informadas.

---

## 3. Épicos (Grandes Temas)

As histórias de usuário são agrupadas nos seguintes épicos:

*   **Épico 1:** Navegação e Visualização do Dashboard
*   **Épico 2:** Gerenciamento do Ciclo de Vida das Transações
*   **Épico 3:** Configuração e Personalização do App

---

### **Épico 1: Navegação e Visualização do Dashboard**

O objetivo deste épico é garantir que os usuários possam acessar a aplicação, identificar-se e obter uma visão clara e completa da sua saúde financeira mensal com o mínimo de esforço.

*   **US-1.1 (Seleção de Contexto de Usuário):**
    *   **Como um** usuário (Leonardo ou Flávia),
    *   **eu quero** poder selecionar meu nome em um menu no topo da aplicação
    *   **para que** o sistema me identifique e possa pré-preencher o campo "Responsável" quando eu for adicionar uma nova transação.

*   **US-1.2 (Visualização Padrão do Mês Atual):**
    *   **Como um** usuário,
    *   **eu quero que** o dashboard carregue automaticamente exibindo os dados do mês atual
    *   **para que** eu tenha acesso imediato às informações financeiras mais relevantes sem precisar fazer filtros.

*   **US-1.3 (Navegação Rápida entre Meses):**
    *   **Como um** usuário,
    *   **eu quero** ver uma fileira de cards representando os meses e poder clicar em qualquer um deles
    *   **para que** todo o dashboard seja atualizado instantaneamente, me permitindo consultar o histórico financeiro de meses passados de forma intuitiva.

*   **US-1.4 (Visão Geral do Balanço Mensal):**
    *   **Como um** usuário,
    *   **eu quero** ver um card de destaque no dashboard que mostre o total de receitas, o total de despesas e o saldo final do mês selecionado
    *   **para que** eu possa entender rapidamente a performance financeira do período.

*   **US-1.5 (Identificação de Contas Atrasadas):**
    *   **Como um** usuário,
    *   **eu quero** ver um card de alerta, separado dos dados do mês, que liste todas as transações (receitas e despesas) de qualquer mês que estão vencidas e não pagas
    *   **para que** eu nunca perca de vista uma pendência, garantindo que tudo seja pago em dia.

*   **US-1.6 (Listagem Separada de Receitas e Despesas):**
    *   **Como um** usuário,
    *   **eu quero** ver as receitas e as despesas do mês selecionado em duas listas separadas, lado a lado e com cores distintas (verde e vermelho)
    *   **para que** eu possa analisar o fluxo de entradas e saídas de forma organizada e visualmente clara.

---

### **Épico 2: Gerenciamento do Ciclo de Vida das Transações**

Este épico cobre as ações fundamentais de criar, modificar e dar baixa em transações, que são o coração da aplicação.

*   **US-2.1 (Registro de Nova Transação):**
    *   **Como um** usuário,
    *   **eu quero** poder abrir um formulário simples para registrar uma nova receita ou despesa, preenchendo sua descrição, valor, vencimento, e selecionando o responsável, a categoria e a forma de pagamento
    *   **para que** eu possa manter o controle financeiro sempre atualizado.

*   **US-2.2 (Edição de Transação Existente):**
    *   **Como um** usuário,
    *   **eu quero** poder clicar em uma transação existente (receita ou despesa) e editar qualquer um dos seus campos
    *   **para que** eu possa corrigir erros ou atualizar informações sem ter que deletar e recriar o lançamento.

*   **US-2.3 (Marcação de Transação como Paga):**
    *   **Como um** usuário,
    *   **eu quero** poder marcar uma transação como "paga" com um único clique em um checkbox ao lado dela na lista
    *   **para que** eu possa dar baixa nas minhas pendências de forma rápida e eficiente, atualizando meu saldo e removendo o item da lista de pendências.

---

### **Épico 3: Configuração e Personalização do App**

Este épico permite que os usuários adaptem a aplicação à sua realidade financeira, gerenciando as opções de categorização.

*   **US-3.1 (Acesso às Páginas de Gerenciamento):**
    *   **Como um** usuário,
    *   **eu quero** ver uma barra de navegação lateral com links para páginas de gerenciamento
    *   **para que** eu possa acessar facilmente as áreas onde posso personalizar as configurações do aplicativo.

*   **US-3.2 (Gerenciamento de Categorias):**
    *   **Como um** usuário,
    *   **eu quero** acessar uma página onde eu possa adicionar, editar e excluir as categorias de despesas e receitas
    *   **para que** as opções de categorização reflitam exatamente meus tipos de gastos e ganhos.

*   **US-3.3 (Gerenciamento de Formas de Pagamento):**
    *   **Como um** usuário,
    *   **eu quero** acessar uma página onde eu possa adicionar, editar e excluir as formas de pagamento (Pix, Crédito, Débito, etc.)
    *   **para que** eu possa registrar minhas transações com precisão, de acordo com o método que utilizei.