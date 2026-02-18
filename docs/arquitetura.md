# Arquitetura Izzy Store

## Visão geral
- Frontend: Angular 17 (standalone + SSR), tema bege minimalista, serviços REST.
- Backend: Spring Boot 3.5 (Java 21), PostgreSQL, segurança JWT, integração Shopify (Draft Order / invoice checkout).
- Infra: CORS via `FRONTEND_ORIGIN`; secrets em variáveis de ambiente.

## Fluxos principais
1) **Autenticação**
   - `POST /auth/login` → JWT (claim `role` = `ROLE_USER|ROLE_ADMIN`), salvo no localStorage.
   - `POST /auth/register` → cria usuário sempre como `USER`.
   - Criação de `ADMIN` é feita apenas por um admin em `POST /admin/usuarios`.

2) **Produtos**
   - Público: `GET /api/produtos` e `GET /api/produtos/{id}`.
   - Admin: CRUD em `/admin/produtos`.
     - `multipart/form-data` (recomendado) para upload de imagem (arquivo `imagem`).
     - `application/json` como fallback.

3) **Carrinho + Checkout**
   - Carrinho client-side (localStorage `izzy_cart`).
   - Checkout: Angular chama `POST /api/checkout/shopify` com itens/endereço →
     - Backend cria Draft Order no Shopify (custom line items) usando Admin API.
     - Salva `Pedido` e `ItemPedido` (status `PENDING`) e devolve `checkoutUrl`/`pedidoId`.
     - Front redireciona para `checkoutUrl` (pagamento Shopify).

4) **Pedidos/Admin**
   - `GET /admin/pedidos` lista pedidos.
   - `PATCH /admin/pedidos/{id}/status?status=PAID|CANCELLED|PENDING` atualiza status.

5) **Usuários/Admin**
   - `GET /admin/usuarios` lista usuários (sem senha).
   - `POST /admin/usuarios` cria usuários e pode atribuir `ADMIN`.

## Modelagem de dados
- `Produto(id, nome, descricao, preco, estoque, categoria, imagem, ativo)`
- `Pedido(id, clienteNome, clienteEmail, enderecoRua, cidade, estado, cep, total, status, checkoutUrl, criadoEm, usuario_id)`
- `ItemPedido(id, produtoId, nome, precoUnitario, quantidade, pedido_id)`

## Segurança
- Endpoints públicos: `/auth/login`, `/auth/register`, `/api/produtos/**`, `/api/checkout/**`, `/uploads/**`, swagger.
- Demais rotas exigem JWT; `/admin/**` exige `ROLE_ADMIN`.
- Segredo JWT configurável (`JWT_SECRET`, 32+ chars); expiração padrão 48h (configurável por `JWT_EXP_HOURS`).

## Integração Shopify
- `SHOPIFY_STORE` (ex: `sualoja.myshopify.com`)
- `SHOPIFY_ADMIN_TOKEN` (Admin API access token)
- Usa Draft Orders (`/admin/api/2024-01/draft_orders.json`) com `custom_line_items` → `invoice_url` retornada ao cliente.
- Storefront token reservado para futuras leituras públicas.

## Origem permitida
- `FRONTEND_ORIGIN` define CORS (padrão `http://localhost:4200`).