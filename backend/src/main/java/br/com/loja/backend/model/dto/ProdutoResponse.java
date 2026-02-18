package br.com.loja.backend.model.dto;

import br.com.loja.backend.model.entity.Produto;

import java.math.BigDecimal;

public record ProdutoResponse(
        Long id,
        String nome,
        String descricao,
        BigDecimal preco,
        Integer estoque,
        String categoria,
        String imagem,
        Boolean ativo
) {
    public static ProdutoResponse from(Produto p) {
        return new ProdutoResponse(
                p.getId(),
                p.getNome(),
                p.getDescricao(),
                p.getPreco(),
                p.getEstoque(),
                p.getCategoria(),
                p.getImagem(),
                p.getAtivo()
        );
    }
}
