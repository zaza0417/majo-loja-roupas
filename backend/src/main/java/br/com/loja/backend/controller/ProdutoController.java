package br.com.loja.backend.controller;

import br.com.loja.backend.model.dto.ProdutoResponse;
import br.com.loja.backend.model.entity.Produto;
import br.com.loja.backend.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoRepository produtoRepository;

    @GetMapping
    public List<ProdutoResponse> listar() {
        return produtoRepository.findAll()
                .stream()
                .map(ProdutoResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponse> buscar(@PathVariable Long id) {
        return produtoRepository.findById(id)
                .map(ProdutoResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
