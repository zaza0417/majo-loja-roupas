package br.com.loja.backend.service;

import br.com.loja.backend.model.Role;
import br.com.loja.backend.model.dto.RegisterRequest;
import br.com.loja.backend.model.entity.Usuario;
import br.com.loja.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public void registrar(RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.email().toLowerCase()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email().toLowerCase())
                .senha(passwordEncoder.encode(request.senha()))
                .role(Role.USER)
                .build();

        usuarioRepository.save(usuario);
    }

    public Usuario criarUsuarioAdmin(String nome, String email, String senha, Role role) {
        if (usuarioRepository.findByEmail(email.toLowerCase()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        Role finalRole = role == null ? Role.USER : role;
        if (finalRole != Role.ADMIN && finalRole != Role.USER) {
            throw new IllegalArgumentException("Role inválida");
        }

        Usuario usuario = Usuario.builder()
                .nome(nome)
                .email(email.toLowerCase())
                .senha(passwordEncoder.encode(senha))
                .role(finalRole)
                .build();

        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
}
