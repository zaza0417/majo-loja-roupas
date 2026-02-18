package br.com.loja.backend.model.dto;

import java.math.BigDecimal;

public record CheckoutItemRequest(
        Long produtoId,
        String nome,
        BigDecimal preco,
        Integer quantidade
) {}
