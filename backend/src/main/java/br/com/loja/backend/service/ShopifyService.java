package br.com.loja.backend.service;

import br.com.loja.backend.model.dto.CheckoutRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopifyService {

    private static final Logger log = LoggerFactory.getLogger(ShopifyService.class);

    @Value("${shopify.store}")
    private String storeDomain;

    @Value("${shopify.admin-token}")
    private String adminToken;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Cria um Draft Order no Shopify e retorna a URL de checkout/invoice.
     * Usamos custom_line_items para não depender de variantes já cadastradas.
     */
    public String criarCheckout(CheckoutRequest req) {
        String url = "https://" + storeDomain + "/admin/api/2024-01/draft_orders.json";

        Map<String, Object> body = new HashMap<>();
        Map<String, Object> draftOrder = new HashMap<>();

        draftOrder.put("email", req.email());

        draftOrder.put("shipping_address", Map.of(
                "address1", req.enderecoRua(),
                "city", req.cidade(),
                "province", req.estado(),
                "zip", req.cep(),
                "country", "Brazil"
        ));

        draftOrder.put("custom_line_items", req.itens().stream().map(item -> Map.of(
                "title", item.nome(),
                "price", item.preco(),
                "quantity", item.quantidade()
        )).collect(Collectors.toList()));

        BigDecimal total = req.itens().stream()
                .map(i -> i.preco().multiply(BigDecimal.valueOf(i.quantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        draftOrder.put("note", "Pedido criado via API Izzy Store. Total: " + total);

        body.put("draft_order", draftOrder);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Shopify-Access-Token", adminToken);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<?, ?> draftOrderResp = (Map<?, ?>) response.getBody().get("draft_order");
            Object invoiceUrl = draftOrderResp != null ? draftOrderResp.get("invoice_url") : null;
            if (invoiceUrl != null) {
                return invoiceUrl.toString();
            }
        }

        log.error("Erro ao criar draft order no Shopify: {}", response);
        throw new RuntimeException("Falha ao criar checkout no Shopify");
    }
}
