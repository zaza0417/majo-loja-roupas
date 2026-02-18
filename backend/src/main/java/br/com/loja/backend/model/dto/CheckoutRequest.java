package br.com.loja.backend.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CheckoutRequest(
        @NotBlank String nome,
        @Email String email,
        @NotBlank String enderecoRua,
        @NotBlank String cidade,
        @NotBlank String estado,
        @NotBlank String cep,
        @NotEmpty List<CheckoutItemRequest> itens,
        String returnUrl
) {}
