package br.com.loja.backend.model.entity;

import br.com.loja.backend.model.PedidoStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clienteNome;
    private String clienteEmail;

    private String enderecoRua;
    private String enderecoCidade;
    private String enderecoEstado;
    private String enderecoCep;

    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private PedidoStatus status;

    private String checkoutUrl;

    private LocalDateTime criadoEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (status == null) {
            status = PedidoStatus.PENDING;
        }
    }
}
