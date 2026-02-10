package br.com.loja.backend.service;

import br.com.loja.backend.model.dto.ProdutoCreateRequest;
import br.com.loja.backend.model.entity.Produto;
import br.com.loja.backend.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;
    private final Path rootLocation = Paths.get("uploads");

    @Transactional
    public Produto salvar(ProdutoCreateRequest prod) {

        Produto produto = Produto.builder()
                .nome(prod.nome())
                .descricao(prod.descricao())
                .preco(prod.preco())
                .estoque(prod.estoque())
                .ativo(prod.ativo())
                .build();

        return repository.save(produto);
    }

    public List<Produto> listar() {
        return repository.findAll();
    }

    public Produto atualizar(ProdutoCreateRequest prod) {
        Produto existente = repository.findByNome(prod.nome());

        existente.setNome(prod.nome());
        existente.setDescricao(prod.descricao());
        existente.setPreco(prod.preco());
        existente.setEstoque(prod.estoque());
        existente.setAtivo(prod.ativo());


        return repository.save(existente);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
    
    private String saveFile(MultipartFile file) {
        try {
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }
            
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
            
            // Return full URL
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(filename)
                    .toUriString();
                    
        } catch (IOException e) {
            throw new RuntimeException("Falha ao salvar arquivo", e);
        }
    }
}
