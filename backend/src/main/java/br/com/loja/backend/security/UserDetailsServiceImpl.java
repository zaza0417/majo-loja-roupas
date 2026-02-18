package br.com.loja.backend.security;
import br.com.loja.backend.model.entity.Usuario;
import br.com.loja.backend.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        Usuario user = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario não encontrado para o email: " + email));

        String roleName = user.getRole() == null ? "USER" : user.getRole().name();
        String authority = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;

        return User.builder()
                .username(user.getEmail())
                .password(user.getSenha())
                .authorities(authority)
                .build();
    }
}
