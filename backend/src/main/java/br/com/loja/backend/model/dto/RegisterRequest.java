package br.com.loja.backend.model.dto;

public record RegisterRequest(
        String nome,
        String email,
        String senha,
        String adminCode
) {}

