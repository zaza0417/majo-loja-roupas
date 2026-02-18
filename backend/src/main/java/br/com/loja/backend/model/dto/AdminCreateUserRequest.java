package br.com.loja.backend.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminCreateUserRequest(
        @NotBlank String nome,
        @Email String email,
        @NotBlank String senha,
        String role
) {}

