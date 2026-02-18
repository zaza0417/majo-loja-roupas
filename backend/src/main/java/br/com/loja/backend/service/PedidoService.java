package br.com.loja.backend.service;

import br.com.loja.backend.model.PedidoStatus;
import br.com.loja.backend.model.dto.CheckoutItemRequest;
import br.com.loja.backend.model.dto.CheckoutRequest;
import br.com.loja.backend.model.entity.ItemPedido;
import br.com.loja.backend.model.entity.Pedido;
import br.com.loja.backend.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    @Transactional
    public Pedido criarPedido(CheckoutRequest req, String checkoutUrl) {
        Pedido pedido = Pedido.builder()
                .clienteNome(req.nome())
                .clienteEmail(req.email())
                .enderecoRua(req.enderecoRua())
                .enderecoCidade(req.cidade())
                .enderecoEstado(req.estado())
                .enderecoCep(req.cep())
                .status(PedidoStatus.PENDING)
                .checkoutUrl(checkoutUrl)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (CheckoutItemRequest item : req.itens()) {
            BigDecimal linhaTotal = item.preco().multiply(BigDecimal.valueOf(item.quantidade()));
            total = total.add(linhaTotal);

            ItemPedido itemPedido = ItemPedido.builder()
                    .produtoId(item.produtoId())
                    .nome(item.nome())
                    .precoUnitario(item.preco())
                    .quantidade(item.quantidade())
                    .pedido(pedido)
                    .build();
            pedido.getItens().add(itemPedido);
        }

        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }
}
