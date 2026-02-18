import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { ProdutoService, Produto } from '../../core/services/produto.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {

  private carrinhoService = inject(CarrinhoService);
  private produtoService = inject(ProdutoService);

  produtos: Produto[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (data) => {
        this.produtos = data.filter(p => p.ativo !== false);
        this.loading = false;
      },
      error: () => {
        this.error = 'Falha ao carregar produtos. Tente novamente.';
        this.loading = false;
      }
    });
  }

  addAoCarrinho(produto: Produto): void {
    this.carrinhoService.addItem(produto, 1);
  }
}
