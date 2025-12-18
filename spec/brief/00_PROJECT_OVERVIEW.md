# 00 - Visão Geral do Projeto (Project Overview)

## 1. Nome do Projeto

**Finanças**

## 2. Introdução e Visão Estratégica

O projeto **Finanças** nasce da necessidade de migrar um sistema de controle financeiro pessoal, atualmente funcional e bem estruturado na plataforma Notion, para uma aplicação web dedicada. O objetivo central é transcender as limitações de uma ferramenta genérica para criar um ambiente focado, ágil e perfeitamente alinhado com a rotina financeira dos seus dois únicos usuários, Leonardo e Flávia.

A visão do projeto não é apenas replicar a funcionalidade existente, mas sim aprimorá-la, focando em simplicidade, controle total e uma experiência de usuário (UX) superior. A aplicação deve servir como um hub centralizado e intuitivo para o gerenciamento de receitas e despesas mensais, pavimentando o caminho para futuras expansões, como a criação de um aplicativo móvel (APK) e a integração de funcionalidades mais complexas.

## 3. Filosofia e Princípios Orientadores

*   **Simplicidade Radical:** Cada funcionalidade e interação deve ser projetada para ser o mais simples e direta possível. O objetivo é reduzir o atrito e o tempo gasto no lançamento e na consulta de informações financeiras.
*   **Controle Total:** Os usuários devem ter a capacidade de gerenciar todos os aspectos dos seus dados, incluindo a personalização de categorias e formas de pagamento, sem depender de estruturas rígidas.
*   **Design Centrado no Usuário:** A interface e a experiência do usuário (UI/UX) devem ser modernas, limpas e visualmente informativas. A inspiração principal será o layout estilo "dashboard" com cards, utilizando temas claro/escuro e destaques de cor (verde para receitas, vermelho para despesas) para facilitar a leitura rápida dos dados.
*   **Arquitetura Evolutiva:** A aplicação será construída sobre uma base modular e escalável, antecipando a adição frequente de novas funcionalidades após o lançamento do MVP. As decisões técnicas devem priorizar a manutenibilidade e a extensibilidade.

## 4. Escopo do Produto Mínimo Viável (MVP)

O MVP focará em entregar um substituto completo e aprimorado para o fluxo de trabalho atual no Notion. As seguintes funcionalidades são consideradas **DENTRO DO ESCOPO** para a primeira versão:

### 4.1. Estrutura de Navegação e Interface Principal
*   **Barra de Navegação Lateral:** Uma barra lateral fixa que permite a navegação entre as seções principais da aplicação.
    *   Link para o "Dashboard".
    *   Link para a página de "Gerenciar Categorias".
    *   Link para a página de "Gerenciar Formas de Pagamento".
*   **Header (Cabeçalho):**
    *   **Seletor de Perfil de Usuário:** Um menu simples no canto superior direito para alternar entre os contextos de "Leonardo" e "Flávia", sem a necessidade de um sistema de login completo.

### 4.2. Dashboard Principal (Design Reference)
*   **Estilo Visual:** Dark Mode predominante. Fundo muito escuro (quase preto), cards em cinza escuro. Cores de destaque vibrantes: Verde (Receitas), Vermelho (Despesas), Laranja (Atrasados).
*   **Seletor de Mês (Carousel):**
    *   Componente centralizado no topo.
    *   Estilo "Carrossel": O mês selecionado fica ao centro, maior e em destaque. Meses anterior e posterior visíveis nas laterais, menores e com opacidade reduzida.
    *   **Card do Mês (Central):** Exibe o Nome do Mês, Total de Receitas (pequeno), Total de Despesas (pequeno) e o **Saldo Final** em destaque (fonte grande).
*   **Seção "Pagamentos Atrasados":**
    *   Localizada logo abaixo do seletor de meses.
    *   Barra de cabeçalho com o total da dívida em Laranja.
    *   Lista de itens atrasados com Data, Descrição e Valor.
*   **Painéis de Transações (Split View):**
    *   Duas colunas lado a lado (em Desktop).
    *   **Esquerda (Receitas):** Container com detalhes em Verde. Cabeçalho com Total. Lista de transações (Card com Título, Data e Valor). Botão "+" flutuante ou fixo na base para adicionar receita.
    *   **Direita (Despesas):** Container com detalhes em Vermelho. Cabeçalho com Total. Lista de transações. Botão "+" para adicionar despesa.

### 4.3. Gerenciamento de Transações
*   **Criação e Edição:** Formulários modais ou em página dedicada para adicionar e editar receitas e despesas. Campos obrigatórios: Descrição, Valor, Vencimento e Responsável.
*   **Status de Pagamento:** Em cada item das listas de transações, haverá um checkbox ou botão que permite marcar a transação como "Paga" com um único clique, com feedback visual imediato.

### 4.4. Gerenciamento de Dados de Suporte (CRUD)
*   **Página de Categorias:** Uma interface para Adicionar, Visualizar, Editar e Remover categorias.
*   **Página de Formas de Pagamento:** Uma interface para Adicionar, Visualizar, Editar e Remover formas de pagamento.

### 4.5. Lógica de Negócio
*   O sistema identificará e selecionará automaticamente o mês atual como padrão no dia primeiro de cada mês.

## 5. Fora do Escopo para o MVP (Evoluções Futuras)

Para garantir o foco e a agilidade na entrega do MVP, as seguintes funcionalidades são explicitamente consideradas **FORA DO ESCOPO** inicial:

*   Sistema de Autenticação completo (login com email/senha, OAuth com Google, etc.).
*   Geração de um aplicativo móvel (APK).
*   Módulo específico para gestão detalhada de "Assinaturas" (como o que existe no Notion).
*   Funcionalidades baseadas em Inteligência Artificial (dicas, análises, etc.).
*   Importação ou exportação de dados (CSV, PDF).
*   Conversão automática de moedas para transações internacionais.
*   Relatórios avançados, gráficos ou painéis de analytics.
*   Metas de economia ou projeções financeiras.

## 6. Critérios de Sucesso para o MVP

O MVP será considerado um sucesso quando:
1.  Os usuários (Leonardo e Flávia) conseguirem realizar 100% de suas rotinas de gerenciamento financeiro mensal na nova aplicação, desativando completamente o uso do Notion para este fim.
2.  A performance da aplicação for ágil, com operações de leitura e escrita no banco de dados sendo executadas de forma rápida e confiável.
3.  A interface do usuário for intuitiva, esteticamente agradável e consistente com as diretrizes visuais acordadas, não exigindo treinamento para o uso.