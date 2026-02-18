package br.com.loja.backend.controller;

import br.com.loja.backend.model.dto.CheckoutRequest;
import br.com.loja.backend.model.dto.CheckoutResponse;
import br.com.loja.backend.service.PedidoService;
import br.com.loja.backend.service.ShopifyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final ShopifyService shopifyService;
    private final PedidoService pedidoService;

    @PostMapping("/shopify")
    public CheckoutResponse checkout(@Valid @RequestBody CheckoutRequest request) {
        String checkoutUrl = shopifyService.criarCheckout(request);
        var pedido = pedidoService.criarPedido(request, checkoutUrl);
        return new CheckoutResponse(checkoutUrl, pedido.getId());
    }
}
