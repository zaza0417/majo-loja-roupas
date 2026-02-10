package br.com.loja.backend.service;

import br.com.loja.backend.model.Role;
import br.com.loja.backend.model.dto.RegisterRequest;
import br.com.loja.backend.model.entity.Usuario;
import br.com.loja.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_CODE = "LOJA-ADMIN-2026";

    public void registrar(RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.email().toLowerCase()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        Role role = Role.USER;

        if (request.adminCode() != null && request.adminCode().equals(ADMIN_CODE)) {
            role = Role.ADMIN;
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email().toLowerCase())
                .senha(passwordEncoder.encode(request.senha()))
                .role(role)
                .build();

        usuarioRepository.save(usuario);
    }

    public java.util.List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
}
