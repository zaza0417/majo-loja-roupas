package br.com.loja.backend.controller;

import br.com.loja.backend.model.PedidoStatus;
import br.com.loja.backend.model.entity.Pedido;
import br.com.loja.backend.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/pedidos")
@RequiredArgsConstructor
public class AdminPedidoController {

    private final PedidoRepository pedidoRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Pedido> listar() {
        return pedidoRepository.findAll();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Pedido atualizarStatus(@PathVariable Long id, @RequestParam PedidoStatus status) {
        Pedido pedido = pedidoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Pedido n\u00e3o encontrado"));
        pedido.setStatus(status);
        return pedidoRepository.save(pedido);
    }
}
