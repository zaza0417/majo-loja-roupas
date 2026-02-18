package br.com.loja.backend.controller;

import br.com.loja.backend.model.Role;
import br.com.loja.backend.model.dto.AdminCreateUserRequest;
import br.com.loja.backend.model.dto.UsuarioResponse;
import br.com.loja.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/usuarios")
@RequiredArgsConstructor
public class AdminUsuarioController {

    private final AuthService authService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioResponse> listar() {
        return authService.listarTodos().stream().map(UsuarioResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponse criar(@Valid @RequestBody AdminCreateUserRequest request) {
        Role role = parseRole(request.role());
        return UsuarioResponse.from(
                authService.criarUsuarioAdmin(request.nome(), request.email(), request.senha(), role)
        );
    }

    private Role parseRole(String roleRaw) {
        if (roleRaw == null || roleRaw.isBlank()) {
            return Role.USER;
        }
        String normalized = roleRaw.trim().toUpperCase();
        return switch (normalized) {
            case "ADMIN", "ROLE_ADMIN" -> Role.ADMIN;
            case "USER", "ROLE_USER" -> Role.USER;
            default -> throw new IllegalArgumentException("Role inválida");
        };
    }
}

