package br.com.loja.backend.repository;

import br.com.loja.backend.model.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProdutoRepository extends JpaRepository<Produto, Long> {
   Produto findByNome(String nome);
}
