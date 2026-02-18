package br.com.loja.backend.controller;

import br.com.loja.backend.model.dto.ProdutoCreateRequest;
import br.com.loja.backend.model.dto.ProdutoMultipartRequest;
import br.com.loja.backend.model.entity.Produto;
import br.com.loja.backend.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/produtos")
@RequiredArgsConstructor
public class AdminProdutoController {

    private final ProdutoService produtoService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public Produto criarJson(@RequestBody ProdutoCreateRequest produto) {
        return produtoService.salvar(produto);
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE + ";charset=UTF-8"})
    @PreAuthorize("hasRole('ADMIN')")
    public Produto criarMultipart(@ModelAttribute ProdutoMultipartRequest req) {
        ProdutoCreateRequest produto = new ProdutoCreateRequest(
                req.getNome(),
                req.getDescricao(),
                req.getPreco(),
                req.getEstoque(),
                req.getAtivo() != null ? req.getAtivo() : Boolean.TRUE,
                req.getCategoria(),
                null
        );

        return produtoService.salvar(produto, req.getImagem());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public Produto atualizarJson(@PathVariable Long id, @RequestBody ProdutoCreateRequest produto) {
        return produtoService.atualizar(id, produto);
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE + ";charset=UTF-8"})
    @PreAuthorize("hasRole('ADMIN')")
    public Produto atualizarMultipart(@PathVariable Long id, @ModelAttribute ProdutoMultipartRequest req) {
        ProdutoCreateRequest produto = new ProdutoCreateRequest(
                req.getNome(),
                req.getDescricao(),
                req.getPreco(),
                req.getEstoque(),
                req.getAtivo() != null ? req.getAtivo() : Boolean.TRUE,
                req.getCategoria(),
                null
        );

        return produtoService.atualizar(id, produto, req.getImagem());
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
