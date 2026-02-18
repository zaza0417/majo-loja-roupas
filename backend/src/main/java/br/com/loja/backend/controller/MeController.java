package br.com.loja.backend.controller;

import br.com.loja.backend.model.dto.UpdateMeRequest;
import br.com.loja.backend.model.dto.UsuarioResponse;
import br.com.loja.backend.model.entity.Usuario;
import br.com.loja.backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public UsuarioResponse me(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository
                .findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        return UsuarioResponse.from(usuario);
    }

    @PutMapping
    public UsuarioResponse atualizar(@Valid @RequestBody UpdateMeRequest req, Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository
                .findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        usuario.setNome(req.nome().trim());

        boolean wantsPasswordChange = req.novaSenha() != null && !req.novaSenha().isBlank();
        if (wantsPasswordChange) {
            if (req.senhaAtual() == null || req.senhaAtual().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual é obrigatória");
            }
            if (req.novaSenha().trim().length() < 6) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A nova senha deve ter pelo menos 6 caracteres");
            }
            if (!passwordEncoder.matches(req.senhaAtual(), usuario.getSenha())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual inválida");
            }
            usuario.setSenha(passwordEncoder.encode(req.novaSenha().trim()));
        }

        usuarioRepository.save(usuario);
        return UsuarioResponse.from(usuario);
    }
}
