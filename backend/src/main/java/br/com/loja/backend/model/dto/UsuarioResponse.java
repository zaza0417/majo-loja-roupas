package br.com.loja.backend.model.dto;

import br.com.loja.backend.model.Role;
import br.com.loja.backend.model.entity.Usuario;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        Role role
) {
    public static UsuarioResponse from(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), u.getRole());
    }
}

