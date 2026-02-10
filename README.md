# 🛍️ Loja de Roupas – Sistema Web Completo

Projeto full stack de um **sistema de venda de roupas**, desenvolvido para uso real em uma loja, com foco em **boas práticas**, **arquitetura moderna** e **diferenciais de mercado** para portfólio no GitHub.

Este projeto contempla **cadastro de produtos**, **controle de estoque**, **vendas**, **autenticação de usuários** e **ambiente containerizado com Docker**.

---

## 🎯 Objetivo do Projeto

- Criar um sistema real de e-commerce para uma loja de roupas
- Evoluir tecnicamente com tecnologias modernas
- Servir como projeto de **portfólio profissional**
- Aplicar conceitos usados no mercado (Docker, segurança, API REST, etc.)

---

## 🧱 Arquitetura

O projeto segue uma arquitetura **Back-end + Front-end desacoplados**, com comunicação via API REST.

loja-roupas/
│
├── backend/ # API REST (Spring Boot)
├── frontend/ # Aplicação Web (Angular)
├── docker/ # Configurações Docker
└── docker-compose.yml


---

## ⚙️ Tecnologias Utilizadas

### 🔹 Back-end
- **Java 21**
- **Spring Boot**
- Spring Web
- Spring Data JPA
- Spring Security (JWT)
- Hibernate
- PostgreSQL
- Maven
- Flyway (migrations)
- Lombok

### 🔹 Front-end
- **Angular**
- TypeScript
- HTML5 / CSS3
- Angular Material
- Reactive Forms
- Auth Guards

### 🔹 Infraestrutura
- **Docker**
- Docker Compose
- PostgreSQL Container
- Variáveis de ambiente (.env)

---

## 🔐 Funcionalidades

### 👤 Usuários
- Cadastro
- Login com autenticação JWT
- Controle de acesso por perfil (ADMIN / USUÁRIO)

### 👕 Produtos
- Cadastro de roupas
- Edição e exclusão
- Controle de estoque
- Categorias e tamanhos

### 💰 Vendas
- Registro de vendas
- Baixa automática de estoque
- Histórico de vendas

### 📊 Futuras melhorias
- Dashboard com gráficos
- Relatórios de vendas
- Upload de imagens
- Paginação e filtros avançados

---

## 🐳 Docker

O projeto roda totalmente via **Docker Compose**, sem precisar instalar banco de dados localmente.

### Subir o projeto:
```bash
docker-compose up -d
