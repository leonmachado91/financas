# 03 - Esquema de Dados (Data Schema)

## 1. Introdução

Este documento define a arquitetura do banco de dados para a aplicação "Finanças". O esquema foi projetado para ser implementado utilizando o **Supabase** (PostgreSQL), refletindo as necessidades funcionais e os relacionamentos entre as diferentes entidades de dados que discutimos. A estrutura visa normalizar os dados, garantir a integridade referencial e fornecer a base para consultas eficientes.

## 2. Diagrama de Relacionamento de Entidades (ERD - Lógico)

+----------------+       +-------------------+       +---------------+
|     Users      |       |    Transactions   |-------|  Categories   |
|----------------|       |-------------------|       |---------------|
| id (PK)        |<-+    | id (PK)           |       | id (PK)       |
| name           |  |    | created_at        |       | name          |
+----------------+  |    | description       |       | owner_id (FK) |
                    |    | amount            |       +---------------+
                    |    | due_date          |
+------------------+     | is_paid           |
| Payment_Methods  |     | type (ENUM)       |       +---------------+
|------------------|     | user_id (FK)      |-------|  Payment_Methods |
| id (PK)          |     | category_id (FK)  |
| name             |<----+ payment_method_id(FK)     (re-apresentado para
| owner_id (FK)    |     +-------------------+      clareza no diagrama)
+------------------+

## 3. Detalhamento das Tabelas

### 3.1. `users`

Armazena os perfis dos usuários da aplicação. Para o MVP, esta tabela conterá apenas dois registros (Leonardo e Flávia) e servirá como referência para o seletor de perfil e o campo "responsável".

| Nome da Coluna | Tipo de Dado     | Restrições / Notas                                      |
|----------------|------------------|---------------------------------------------------------|
| `id`           | `uuid`           | Chave Primária. Gerada automaticamente.                 |
| `created_at`   | `timestampz(6)`  | Data/Hora de criação. Valor padrão `now()`.             |
| `name`         | `text`           | **Not Null**. O nome do usuário (ex: "Leonardo Machado"). |

---

### 3.2. `transactions`

A tabela central da aplicação. Cada registro representa uma única receita ou despesa.

| Nome da Coluna        | Tipo de Dado     | Restrições / Notas                                                                    |
|-----------------------|------------------|---------------------------------------------------------------------------------------|
| `id`                  | `uuid`           | Chave Primária. Gerada automaticamente.                                                 |
| `created_at`          | `timestampz(6)`  | Data/Hora de criação. Valor padrão `now()`.                                             |
| `description`         | `text`           | **Not Null**. Descrição da transação (ex: "Fatura Nubank MEI").                       |
| `amount`              | `numeric`        | **Not Null**. O valor monetário. Recomenda-se `numeric` para evitar erros de ponto flutuante. |
| `due_date`            | `date`           | **Not Null**. Data de vencimento da transação.                                          |
| `is_paid`             | `boolean`        | **Not Null**, **Default `false`**. Indica se a transação foi paga.                       |
| `type`                | `ENUM`           | **Not Null**. Tipo customizado `transaction_type` com valores: `'income'`, `'expense'`.  |
| `user_id`             | `uuid`           | Chave Estrangeira -> `users.id`. O "responsável" pela transação. **Not Null**.         |
| `category_id`         | `uuid`           | Chave Estrangeira -> `categories.id`. Categoria da transação. **Null-able**.            |
| `payment_method_id`   | `uuid`           | Chave Estrangeira -> `payment_methods.id`. Forma de pagamento. **Null-able**.          |

---

### 3.3. `categories`

Tabela de suporte para categorizar as transações. É gerenciável pelos usuários.

| Nome da Coluna | Tipo de Dado     | Restrições / Notas                                      |
|----------------|------------------|---------------------------------------------------------|
| `id`           | `uuid`           | Chave Primária. Gerada automaticamente.                 |
| `created_at`   | `timestampz(6)`  | Data/Hora de criação. Valor padrão `now()`.             |
| `name`         | `text`           | **Not Null**. **Unique**. O nome da categoria (ex: "Moradia"). |
| `owner_id`     | `uuid`           | Chave Estrangeira -> `users.id`. Identifica qual usuário criou a categoria, permitindo futura segregação (embora no MVP tudo seja compartilhado). **Null-able** (para categorias padrão). |

---

### 3.4. `payment_methods`

Tabela de suporte para as formas de pagamento utilizadas. Também gerenciável pelos usuários.

| Nome da Coluna | Tipo de Dado     | Restrições / Notas                                           |
|----------------|------------------|--------------------------------------------------------------|
| `id`           | `uuid`           | Chave Primária. Gerada automaticamente.                      |
| `created_at`   | `timestampz(6)`  | Data/Hora de criação. Valor padrão `now()`.                  |
| `name`         | `text`           | **Not Null**. **Unique**. O nome da forma de pagamento (ex: "Pix"). |
| `owner_id`     | `uuid`           | Chave Estrangeira -> `users.id`. Semelhante à tabela `categories`. **Null-able**. |


## 4. Tipos Customizados (ENUMs)

É necessário criar o seguinte tipo `ENUM` no PostgreSQL para a coluna `transactions.type`.

*   **Nome:** `transaction_type`
*   **Valores:** `'income'`, `'expense'`

Isso garante que apenas esses dois valores possam ser inseridos na coluna, mantendo a integridade dos dados.

## 5. RLS (Row Level Security) - Políticas de Acesso

Embora o MVP tenha um modelo de acesso totalmente compartilhado (Leonardo e Flávia veem tudo), a estrutura do banco de dados já está preparada para a implementação de segurança a nível de linha no Supabase.

*   **Política de Acesso Futura:** Em futuras versões, políticas de RLS poderiam ser ativadas para garantir que um usuário só possa visualizar e editar registros (categorias, formas de pagamento, transações) que ele mesmo criou ou que foram compartilhados com ele. Para o MVP, essa política pode ser configurada para `true`, permitindo acesso total a usuários autenticados.

*   **Política para a Tabela `users`:** Será necessário configurar a política para permitir que um usuário autenticado possa ler a lista de todos os usuários (para popular o seletor de perfil).

Esta estrutura de banco de dados é robusta, escalável e alinhada com as melhores práticas, fornecendo uma fundação sólida para a aplicação "Finanças".