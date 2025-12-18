# 05 - Arquitetura Técnica (Technical Architecture)

## 1. Introdução

Este documento delineia a arquitetura técnica, a stack tecnológica e os padrões de desenvolvimento recomendados para o projeto "Finanças". O foco principal é criar uma base de código modular, manutenível e escalável, que atenda aos requisitos do MVP e facilite a adição de novas funcionalidades no futuro. A arquitetura também leva em consideração as limitações específicas do ambiente de desenvolvimento (Google AI Studio).

## 2. Stack Tecnológica Recomendada

Para um projeto com estas características, uma stack moderna baseada em JavaScript/TypeScript é altamente recomendada pela sua produtividade, ecossistema robusto e adequação ao desenvolvimento reativo de interfaces.

*   **Banco de Dados (Backend as a Service):**
    *   **Supabase:** Já definido. Utilizaremos seu banco de dados PostgreSQL, autenticação (mesmo que simplificada no início), e principalmente suas APIs de dados `postgrest-js`, que geram APIs RESTful automaticamente a partir do schema do banco.

*   **Framework Frontend:**
    *   **Vue.js (com Nuxt 3) ou React (com Next.js):** Ambos são excelentes escolhas. A decisão final pode ser do desenvolvedor, mas para a simplicidade e a reatividade que o projeto exige, **Vue.js com Nuxt 3** pode oferecer uma curva de aprendizado mais suave e uma configuração inicial mais rápida ("opinionated framework"). A reatividade nativa do Vue se encaixa perfeitamente na atualização dinâmica do dashboard.
    *   **Alternativa para o Google AI Studio:** Se o uso de frameworks complexos for um problema, uma abordagem com **HTML, CSS e JavaScript puro (Vanilla JS)** ou com uma biblioteca leve como **Lit** ou **Alpine.js** é viável. Isso minimizaria a necessidade de um passo de *build* complexo, alinhando-se melhor às limitações da IDE. Dado o contexto, **desenvolver com Vanilla JS pode ser o caminho mais seguro para garantir a execução dentro do ambiente.**

*   **Bibliotecas de UI/Componentes:**
    *   **Tailwind CSS:** Altamente recomendado para a estilização. É um framework utility-first que permite construir designs customizados (como o "KokonuUI") rapidamente, sem escrever CSS tradicional. É mais flexível que bibliotecas de componentes prontas como Bootstrap ou Materialize.

*   **Cliente Supabase:**
    *   `@supabase/supabase-js`: A biblioteca oficial do Supabase para interagir com o backend a partir do frontend. Essencial para realizar as operações de CRUD (Create, Read, Update, Delete) nas tabelas.

## 4. Padrões e Princípios de Arquitetura

*   **Separação de Responsabilidades (SoC):**
    *   **UI (HTML/CSS):** A estrutura e a aparência da aplicação.
    *   **Lógica de Estado (JavaScript):** Manter o estado da aplicação (ex: `usuarioSelecionado`, `mesSelecionado`, `listaDeTransacoes`).
    *   **Serviços de Dados (JavaScript):** Módulos/funções dedicados a se comunicar com o Supabase. Toda a lógica de `fetch`, `insert`, `update` deve ser abstraída aqui. Por exemplo, uma função `fetchTransactionsByMonth(month)` em vez de espalhar chamadas do Supabase pelo código.

*   **Desenvolvimento Orientado a Componentes (Lógico):**
    *   Mesmo em Vanilla JS, o código deve ser pensado de forma "componentizada". Criar funções responsáveis por renderizar e gerenciar partes específicas da UI (ex: `renderMonthSelector()`, `renderTransactionsList(transactions)`). Cada função gerencia seu próprio pedaço do DOM.

*   **Estado Centralizado (Simplificado):**
    *   Para o MVP, um objeto JavaScript simples e global pode servir como um "store" para o estado da aplicação.
    *   **Exemplo:**
        ```javascript
        const appState = {
          currentUser: null, // 'Leonardo' ou 'Flavia'
          selectedMonth: new Date().getMonth() + 1,
          transactions: [],
          overdueTransactions: []
        };
        ```
    *   As funções devem ler deste estado para renderizar a UI e atualizá-lo após ações do usuário ou busca de dados. Um padrão "Observer" simples pode ser implementado para re-renderizar componentes quando o estado muda.

*   **Tratamento de Assincronicidade:**
    *   Todas as chamadas para o Supabase são assíncronas. O código deve usar `async/await` extensivamente para lidar com isso de forma limpa.
    *   A UI deve fornecer feedback durante as operações de rede (ex: exibir um *spinner* ou desabilitar um botão enquanto os dados estão sendo salvos).

## 5. Fluxo de Dados

1.  **Inicialização:**
    *   `index.html` carrega `dashboard.js`.
    *   `supabase-client.js` é inicializado.
    *   O estado inicial da aplicação (`appState`) é definido (mês atual).
2.  **Primeira Renderização:**
    *   Funções de busca de dados são chamadas (ex: `fetchTransactionsByMonth(appState.selectedMonth)`).
    *   `await` garante que os dados cheguem do Supabase.
    *   O `appState` é populado com os dados.
    *   As funções de renderização (`render...()`) são chamadas para construir o DOM com base no `appState`.
3.  **Interação do Usuário (Ex: Troca de Mês):**
    *   Um *event listener* no seletor de mês dispara uma função.
    *   A função atualiza `appState.selectedMonth`.
    *   A atualização do estado dispara a re-execução do ciclo: `fetch` de novos dados -> atualização do `appState` -> re-renderização das partes relevantes da UI.

Este guia técnico oferece um caminho claro para um desenvolvimento estruturado e de alta qualidade, mesmo dentro de um ambiente com restrições, garantindo que o "Finanças" seja construído sobre uma base sólida.