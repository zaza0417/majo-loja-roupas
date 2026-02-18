# API Izzy Store

Base URL (dev): `http://localhost:8080`

## Auth
- `POST /auth/login` — body `{ email, senha }` → text token (JWT)
- `POST /auth/register` — body `{ nome, email, senha }` → 201

## Produtos públicos
- `GET /api/produtos` → `[ProdutoResponse]`
- `GET /api/produtos/{id}` → `ProdutoResponse`

`ProdutoResponse`:
```json
{
  "id": 1,
  "nome": "Camisa",
  "descricao": "Algodão",
  "preco": 129.9,
  "estoque": 10,
  "categoria": "Básicos",
  "imagem": "https://...",
  "ativo": true
}
```

## Admin Produtos (JWT ADMIN)
- `POST /admin/produtos`
  - `multipart/form-data` (recomendado): campos `nome, descricao, preco, estoque, ativo, categoria?` + arquivo `imagem`
  - `application/json` (fallback): body `ProdutoCreateRequest`
- `PUT /admin/produtos/{id}`
  - `multipart/form-data` (recomendado): mesmos campos + `imagem` opcional (se não enviar, mantém a imagem atual)
  - `application/json` (fallback): body `ProdutoCreateRequest`
- `DELETE /admin/produtos/{id}`
- `GET /admin/produtos`

`ProdutoCreateRequest` = `nome, descricao, preco, estoque, ativo, categoria?, imagem?`

Uploads:
- Arquivos são servidos em `/uploads/**`
- O campo `imagem` nos produtos retorna uma URL para essa rota.

## Checkout / Pedidos
- `POST /api/checkout/shopify`
```json
{
  "nome": "Ana",
  "email": "ana@mail.com",
  "enderecoRua": "Rua A, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01000-000",
  "itens": [
    { "produtoId": 1, "nome": "Camisa", "preco": 129.9, "quantidade": 2 }
  ],
  "returnUrl": "http://localhost:4200/checkout"
}
```
- Response: `{ "checkoutUrl": "https://.../orders/...", "pedidoId": 42 }`

## Admin Pedidos (JWT ADMIN)
- `GET /admin/pedidos`
- `PATCH /admin/pedidos/{id}/status?status=PAID|CANCELLED|PENDING`

## Admin Usuários (JWT ADMIN)
- `GET /admin/usuarios`
- `POST /admin/usuarios`
```json
{
  "nome": "Izzy Admin",
  "email": "admin@izzy.com",
  "senha": "123456",
  "role": "ADMIN"
}
```

## Conta do usuário (JWT)
- `GET /api/me` → `UsuarioResponse`
- `PUT /api/me` — body:
```json
{
  "nome": "Seu nome",
  "senhaAtual": "opcional (necessária para trocar senha)",
  "novaSenha": "opcional"
}
```
