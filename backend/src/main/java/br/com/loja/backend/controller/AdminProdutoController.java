package br.com.loja.backend.controller;

import br.com.loja.backend.model.dto.ProdutoCreateRequest;
import br.com.loja.backend.model.entity.Produto;
import br.com.loja.backend.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/admin/produtos")
@RequiredArgsConstructor
public class AdminProdutoController {

    private final ProdutoService produtoService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Produto criar(
            @PathVariable ProdutoCreateRequest produto
    ) {
        return produtoService.salvar(produto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Produto atualizar(
            @PathVariable ProdutoCreateRequest produto
    ) {
        return produtoService.atualizar(produto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void excluir(@PathVariable Long id) {
        produtoService.excluir(id);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Produto> listar() {
        return produtoService.listar();
    }
}
