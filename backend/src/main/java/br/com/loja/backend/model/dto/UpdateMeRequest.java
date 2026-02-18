package br.com.loja.backend.model.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateMeRequest(
        @NotBlank String nome,
        String senhaAtual,
        String novaSenha
) {
}

