# 02 - Especificação Funcional (Functional Specification)

## 1. Introdução

Este documento detalha o comportamento esperado de cada componente da aplicação "Finanças". Ele serve como um guia para a equipe de desenvolvimento, descrevendo as regras de negócio, interações de interface e lógicas de funcionamento, garantindo que o produto final opere conforme o plano estabelecido durante a fase de consulta.

---

## 2. Estrutura Geral da Aplicação

### 2.1. Barra de Navegação Lateral
*   **Comportamento:** Fica permanentemente visível no lado esquerdo da tela em resoluções de desktop.
*   **Componentes:**
    *   **Link "Dashboard":** Ao ser clicado, navega o usuário para a tela principal (Dashboard). Deve indicar visualmente que está "ativo" quando o usuário estiver nesta tela.
    *   **Link "Gerenciar Categorias":** Navega para a página de gerenciamento de categorias.
    *   **Link "Gerenciar Formas de Pagamento":** Navega para a página de gerenciamento de formas de pagamento.
*   **Regra:** Não é visível em telas de gerenciamento (CRUD) para manter o foco na tarefa. (Decisão de implementação a ser validada: pode ser mantida visível para consistência).

### 2.2. Cabeçalho (Header)
*   **Comportamento:** Fixo no topo da área de conteúdo, à direita da barra lateral.
*   **Componentes:**
    *   **Seletor de Perfil:**
        *   **Estado Padrão:** Exibe um placeholder como "Selecionar Usuário" ou o nome do último usuário selecionado na sessão.
        *   **Interação:** Ao ser clicado, exibe um menu dropdown com as opções "Leonardo" e "Flávia".
        *   **Lógica:**
            1.  Uma vez que um perfil é selecionado (ex: "Leonardo"), esse nome é armazenado no estado global da aplicação.
            2.  Este estado (`usuarioSelecionado`) será usado para pré-preencher o campo "Responsável" no formulário de adição de nova transação.
            3.  Esta seleção NÃO filtra as transações visíveis no dashboard, que sempre mostra os dados de ambos os usuários.

---

## 3. Tela Principal (Dashboard)

O Dashboard é a tela central e mais interativa da aplicação. Seu estado é primariamente controlado pela variável `mesSelecionado`.

### 3.1. Seletor de Mês por Cards
*   **Visual:** Uma faixa horizontal no topo do conteúdo contendo 12 cards, um para cada mês do ano corrente.
*   **Lógica:**
    *   **Carregamento Inicial:** Ao carregar a página, o sistema verifica a data atual e aplica um estilo de "ativo" (ex: borda colorida) ao card correspondente ao mês atual. A variável `mesSelecionado` é definida para este mês.
    *   **Interação:** Clicar em qualquer card de mês (ex: "Junho") atualiza a variável de estado `mesSelecionado` para "Junho".
    *   **Reatividade:** Qualquer mudança na variável `mesSelecionado` deve disparar uma nova busca de dados para os componentes dependentes (Balanço do Mês e Listas de Transações), re-renderizando-os com os dados filtrados para aquele mês.

### 3.2. Card: Balanço do Mês
*   **Fonte de Dados:** Recebe os totais calculados (soma) das transações filtradas por `mesSelecionado`.
*   **Exibição:**
    *   **Total Receitas:** Mostra a soma formatada em moeda (R$) de todas as receitas do mês. Cor verde.
    *   **Total Despesas:** Mostra a soma formatada em moeda (R$) de todas as despesas do mês. Cor vermelha.
    *   **Sobrou:** Exibe o resultado de `(Total Receitas - Total Despesas)`, formatado em moeda. A cor do valor deve ser verde se o resultado for positivo e vermelha se for negativo.

### 3.3. Card: Pagamentos Atrasados
*   **Lógica de Negócio (Crucial):** Este componente é independente do filtro `mesSelecionado`.
*   **Fonte de Dados:** Realiza uma consulta ao banco de dados com os seguintes filtros: `(status_pago == false) E (data_vencimento < data_atual)`.
*   **Exibição:** Lista todas as transações que correspondem ao filtro. Se não houver transações atrasadas, exibe uma mensagem amigável (ex: "Nenhuma pendência encontrada. Tudo em dia!").

### 3.4. Cards de Transações (Receitas e Despesas)
*   **Estrutura:** Dispostos lado a lado.
*   **Card de Receitas:**
    *   **Fonte de Dados:** Lista de transações com `tipo == 'receita'` E pertencentes ao `mesSelecionado`.
    *   **Visual:** Container com fundo/tema verde.
    *   **Exibição por Item:** Cada item na lista deve exibir: Descrição, Valor, Data de Vencimento, Responsável.
*   **Card de Despesas:**
    *   **Fonte de Dados:** Lista de transações com `tipo == 'despesa'` E pertencentes ao `mesSelecionado`.
    *   **Visual:** Container com fundo/tema vermelho.
    *   **Exibição por Item:** Similar ao item de receita.

---

## 4. Funcionalidades de Transações

### 4.1. Adicionar / Editar Transação (Formulário)
*   **Acesso:** Através de um botão "Nova Transação" no dashboard. A edição é acionada por um ícone de "editar" em cada item de transação.
*   **Campos:**
    *   **Tipo:** Botões de rádio ou switch para selecionar "Receita" ou "Despesa".
    *   **Descrição:** Campo de texto (obrigatório).
    *   **Valor:** Campo numérico, formatado para moeda (obrigatório).
    *   **Data de Vencimento:** Seletor de data (obrigatório).
    *   **Responsável:** Dropdown preenchido com "Leonardo" e "Flávia". Deve vir pré-selecionado com base no `usuarioSelecionado` do header (obrigatório).
    *   **Categoria:** Dropdown populado pela tabela `Categorias` do banco de dados.
    *   **Forma de Pagamento:** Dropdown populado pela tabela `Formas_de_Pagamento`.
    *   **Pago:** Checkbox, desmarcado por padrão.
*   **Regra de Submissão:** O formulário só pode ser enviado se os campos obrigatórios estiverem preenchidos. Ao submeter, um novo registro é criado (ou um existente é atualizado) na tabela de transações do banco de dados. A interface deve ser atualizada para refletir a mudança.

### 4.2. Marcar como Paga (Ação Rápida)
*   **Gatilho:** Clique no checkbox ao lado de uma transação nas listas.
*   **Lógica:**
    1.  O estado `pago` daquela transação é imediatamente alterado para `true` no frontend para feedback visual rápido.
    2.  Uma requisição assíncrona é enviada ao Supabase para atualizar o registro no banco de dados.
    3.  **Feedback Visual:** A linha da transação deve mudar seu estilo (ex: texto riscado, opacidade reduzida).
    4.  **Reatividade:** Após a conclusão da ação, a transação deve ser removida da lista de "Atrasados" (se estivesse lá) e o "Balanço do Mês" pode ser recalculado, dependendo da lógica implementada.

---

## 5. Páginas de Gerenciamento (CRUD)

O comportamento para "Gerenciar Categorias" e "Gerenciar Formas de Pagamento" é idêntico, mudando apenas a entidade.

### 5.1. Visualização (Read)
*   A página exibe uma tabela simples listando todos os registros existentes (ex: todas as categorias).
*   Cada linha da tabela deve ter botões de "Editar" e "Excluir".
*   A página deve conter um botão "Adicionar Novo".

### 5.2. Criação (Create)
*   Clicar em "Adicionar Novo" abre um modal ou formulário com um único campo de texto para o nome do novo item.
*   Ao salvar, o novo item é adicionado ao banco de dados e a tabela na tela é atualizada.

### 5.3. Edição (Update)
*   Clicar em "Editar" abre um modal/formulário com o nome do item selecionado.
*   Ao salvar as alterações, o registro é atualizado no banco de dados e a tabela é atualizada.

### 5.4. Exclusão (Delete)
*   Clicar em "Excluir" deve exibir um modal de confirmação para prevenir exclusões acidentais ("Você tem certeza?").
*   Após a confirmação, o registro é removido do banco de dados e a linha some da tabela.