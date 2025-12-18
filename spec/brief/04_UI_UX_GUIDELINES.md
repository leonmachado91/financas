# 04 - Diretrizes de UI/UX (Interface e Experiência do Usuário)

## 1. Introdução

Este documento consolida as diretrizes de design visual, layout e interação para a aplicação "Finanças". O objetivo é criar uma experiência de usuário (UX) coesa, intuitiva e esteticamente agradável, que transforme a tarefa de gerenciamento financeiro em algo rápido e descomplicado. As decisões aqui se baseiam nas referências visuais discutidas (especialmente a inspiração no "KokonuUI") e nas funcionalidades definidas.

## 2. Filosofia Visual e de Experiência

*   **Clareza Acima de Tudo:** A interface deve apresentar as informações financeiras de forma clara e direta. Evitar poluição visual, elementos desnecessários e ambiguidades.
*   **Design Orientado por Dados:** Usar a cor como uma ferramenta funcional para transmitir significado. Verde indica ganhos, entradas e estados positivos. Vermelho indica gastos, saídas e alertas. Cores neutras (tons de cinza, branco/preto) devem formar a base do layout.
*   **Consistência:** Componentes de interface (botões, cards, formulários) devem ter um estilo consistente em toda a aplicação.
*   **Feedback Imediato:** O usuário deve receber feedback visual instantâneo para cada ação importante, como marcar uma transação como paga ou salvar um formulário.

## 3. Tema e Paleta de Cores

A aplicação será construída com base em um tema escuro (Dark Mode), conforme a principal referência visual.

*   **Fundo Principal (Background):** Um cinza muito escuro, quase preto (#121212 ou similar).
*   **Fundo dos Cards (Surface):** Um cinza ligeiramente mais claro para criar contraste com o fundo (#1E1E1E ou similar).
*   **Cor Primária (Ênfase Positiva/Receitas):** Um tom de verde claro e vibrante (ex: #28A745).
*   **Cor Secundária (Ênfase Negativa/Despesas):** Um tom de vermelho claro, mas não excessivamente alarmante (ex: #DC3545).
*   **Cor de Destaque/Ação (Accent):** Um tom de azul ou roxo para botões primários ("Nova Transação"), links ativos e seletores, para se destacar das cores funcionais (verde/vermelho). (ex: #0D6EFD).
*   **Texto Principal:** Branco ou um cinza muito claro (#FFFFFF, #EAEAEA).
*   **Texto Secundário/Subtítulos:** Um cinza mais suave para menor hierarquia (#A0A0A0).

## 4. Layout e Estrutura das Telas

### 4.1. Estrutura Geral (Desktop-First)
*   **Layout Fixo:** A estrutura será composta por uma barra lateral de navegação fixa à esquerda e uma área de conteúdo principal à direita, com um cabeçalho fixo no topo.
*   **Grid System:** O conteúdo principal do dashboard será organizado em um sistema de grid para garantir alinhamento e responsividade. A inspiração visual sugere um layout de duas colunas principais para os cards.
*   **Espaçamento:** Utilizar espaçamento generoso entre os elementos (margens, paddings) para evitar uma sensação de "aperto" e melhorar a legibilidade.

### 4.2. Layout do Dashboard (Conforme Versão 2.0 do plano)
*   **Header:**
    *   À direita, o Seletor de Perfil deve ser um botão com o ícone do usuário e o nome, abrindo um pequeno dropdown.
*   **Linha 1: Visão Geral e Controles:**
    *   **Seletor de Mês:** Cards compactos em linha, com texto claro. O card do mês ativo deve ter um fundo ou borda na cor de Destaque (azul/roxo).
    *   **Balanço do Mês:** Um card com os três totais empilhados verticalmente, cada um com seu título ("Total Receitas") e o valor formatado.
    *   **Pagamentos Atrasados:** Um card com um título de destaque e um ícone de alerta. A lista interna de transações deve ser limpa e direta.
*   **Linha 2: Detalhamento do Mês:**
    *   **Card de Receitas:** Título "Receitas". O fundo geral do card ou o cabeçalho deve usar um tom sutil da Cor Primária (verde).
    *   **Card de Despesas:** Título "Despesas". Fundo/cabeçalho com tom sutil da Cor Secundária (vermelho).
    *   Os dois cards devem estar alinhados horizontalmente, ocupando a mesma altura para harmonia visual.

### 4.3. Listas e Tabelas de Transações
*   **Checkbox de Pagamento:** O primeiro elemento de cada linha deve ser o checkbox para "Marcar como Pago". Deve ser grande o suficiente para ser facilmente clicável.
*   **Tipografia:** A descrição da transação deve ter maior peso visual. Valor, data e responsável devem usar um texto com menor destaque (cor ou tamanho).
*   **Valores:** Sempre alinhar os valores monetários à direita para facilitar a comparação visual dos números.
*   **Feedback Visual ao Pagar:** Ao marcar como pago, a linha inteira deve aplicar um estilo `text-decoration: line-through` e ter sua opacidade reduzida, antes de ser potencialmente removida da visualização.

### 4.4. Formulários (Adicionar/Editar)
*   **Acesso:** Preferencialmente através de um Modal, para manter o usuário no contexto do dashboard.
*   **Design:** Campos de formulário limpos, com labels claras acima de cada campo. Botões de "Salvar" e "Cancelar" bem definidos.
*   **Validação:** A validação de erros deve ser em tempo real (inline), exibindo uma mensagem discreta (vermelha) abaixo do campo com problema, para evitar que o usuário preencha tudo e só descubra o erro ao tentar salvar.

## 5. Ícones
*   Utilizar um conjunto de ícones consistente (ex: Lucide, Feather Icons, Font Awesome).
*   **Ícones Funcionais:**
    *   Ícone de "calendário" ao lado de datas.
    *   Ícone de "usuário" ou avatar ao lado do responsável.
    *   Ícone de "tag" para categoria, "cartão de crédito" para forma de pagamento.
    *   Ícones de "editar" e "excluir" nas páginas de gerenciamento.
    *   Ícone de "+" para botões de "Adicionar".

Estas diretrizes formam a base para o trabalho do desenvolvedor frontend, garantindo que o produto final não apenas funcione bem, mas também seja visualmente coeso e agradável de usar.