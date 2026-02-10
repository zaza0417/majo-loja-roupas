package br.com.loja.backend.controller;

import br.com.loja.backend.model.dto.LoginRequest;
import br.com.loja.backend.model.dto.RegisterRequest;
import br.com.loja.backend.security.JwtService;
import br.com.loja.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final AuthService authService;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        System.out.println("Login attempt for: " + request.email());

        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email().toLowerCase(), request.senha()
                )
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return jwtService.gerarToken(userDetails);

    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody RegisterRequest request) {
        authService.registrar(request);
    }

    @GetMapping("/users")
    public java.util.List<br.com.loja.backend.model.entity.Usuario> listarUsuarios() {
        return authService.listarTodos();
    }
}
