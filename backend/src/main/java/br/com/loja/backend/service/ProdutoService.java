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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;
    private final Path rootLocation = Paths.get("uploads");

    @Transactional
    public Produto salvar(ProdutoCreateRequest prod) {
        return salvar(prod, null);
    }

    @Transactional
    public Produto salvar(ProdutoCreateRequest prod, MultipartFile imagemFile) {
        String imagem = prod.imagem();
        if (imagemFile != null && !imagemFile.isEmpty()) {
            imagem = saveFile(imagemFile);
        }

        Produto produto = Produto.builder()
                .nome(prod.nome())
                .descricao(prod.descricao())
                .preco(prod.preco())
                .estoque(prod.estoque())
                .categoria(prod.categoria())
                .imagem(imagem)
                .ativo(prod.ativo())
                .build();

        return repository.save(produto);
    }

    public List<Produto> listar() {
        return repository.findAll();
    }

    public Produto atualizar(Long id, ProdutoCreateRequest prod) {
        return atualizar(id, prod, null);
    }

    public Produto atualizar(Long id, ProdutoCreateRequest prod, MultipartFile imagemFile) {
        Produto existente = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));

        existente.setNome(prod.nome());
        existente.setDescricao(prod.descricao());
        existente.setPreco(prod.preco());
        existente.setEstoque(prod.estoque());
        existente.setCategoria(prod.categoria());
        existente.setAtivo(prod.ativo());

        if (imagemFile != null && !imagemFile.isEmpty()) {
            existente.setImagem(saveFile(imagemFile));
        } else if (prod.imagem() != null && !prod.imagem().isBlank()) {
            // Mantém compatibilidade com update via JSON (imagem por URL).
            existente.setImagem(prod.imagem());
        }

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

            String contentType = file.getContentType();
            if (contentType != null && !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Arquivo deve ser uma imagem");
            }

            String originalFilename = file.getOriginalFilename();
            String safeOriginalFilename = originalFilename == null ? "imagem" : Paths.get(originalFilename).getFileName().toString();
            safeOriginalFilename = safeOriginalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");

            String filename = UUID.randomUUID() + "_" + safeOriginalFilename;
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            
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

