# MEI Finance - Backend

## Sobre o projeto

O **MEI Finance** é um SaaS de controle financeiro desenvolvido para atender uma necessidade comum entre Microempreendedores Individuais (MEIs): a dificuldade em manter uma gestão financeira simples, organizada e acessível no dia a dia.

Grande parte dos pequenos empreendedores ainda utiliza anotações em papel, planilhas genéricas ou até mesmo o extrato bancário para controlar receitas e despesas. Essa falta de organização dificulta a visualização da saúde financeira do negócio e pode levar a problemas como perda de controle do fluxo de caixa e ultrapassagem do limite anual de faturamento do MEI.

O projeto tem como objetivo oferecer uma solução minimalista e intuitiva, permitindo que o usuário registre movimentações financeiras, acompanhe indicadores essenciais do negócio e monitore seu faturamento de forma rápida, sem a complexidade encontrada em sistemas ERP tradicionais.

Este repositório contém a camada **backend** da aplicação, responsável pela autenticação, gerenciamento das regras de negócio, persistência dos dados e disponibilização da API REST consumida pelo frontend.


## API Routes

### Authentication

| Method | Endpoint | Description |
|:------:|:----------|:------------|
| `POST` | `/api/auth/register` | Create a new user account. |
| `POST` | `/api/auth/login` | Authenticate user and return JWT token. |
| `GET` | `/api/auth/me` | Return authenticated user information. |

### Transactions

| Method | Endpoint | Description |
|:------:|:----------|:------------|
| `GET` | `/api/transactions` | List all user transactions. |
| `POST` | `/api/transactions` | Create a new transaction. |
| `PUT` | `/api/transactions/:id` | Update an existing transaction. |
| `DELETE` | `/api/transactions/:id` | Delete a transaction. |

### Categories

| Method | Endpoint | Description |
|:------:|:----------|:------------|
| `GET` | `/api/categories` | List available categories. |
| `POST` | `/api/categories` | Create a new category. |
| `PUT` | `/api/categories/:id` | Update a category. |
| `DELETE` | `/api/categories/:id` | Remove a category. |

### Dashboard

| Method | Endpoint | Description |
|:------:|:----------|:------------|
| `GET` | `/api/dashboard/summary` | Return dashboard financial summary. |
| `GET` | `/api/dashboard/mei-limit` | Return MEI annual limit usage. |

### Reports

| Method | Endpoint | Description |
|:------:|:----------|:------------|
| `GET` | `/api/reports/monthly` | Generate monthly financial report. |
| `GET` | `/api/reports/export/csv` | Export transactions as CSV. |

<img width="1536" height="1024" alt="ChatGPT Image 11_06_2026, 11_07_28" src="https://github.com/user-attachments/assets/36d2c707-5a1c-4d1d-bc93-6aa9bcfc37f2" />

<img width="1536" height="1024" alt="ChatGPT Image 11_06_2026, 10_59_35" src="https://github.com/user-attachments/assets/bc7ec7c9-623f-471e-96b8-de7c683d3f4c" />
