package br.com.loja.backend.model.dto;

import java.math.BigDecimal;

public record ProdutoCreateRequest(
        String nome,
        String descricao,
        BigDecimal preco,
        Integer estoque,
        Boolean ativo
) {}
