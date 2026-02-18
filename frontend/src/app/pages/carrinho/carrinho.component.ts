import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarrinhoService, CarrinhoItem } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.scss'
})
export class CarrinhoComponent {
  private carrinhoService = inject(CarrinhoService);

  itens$ = this.carrinhoService.items$;
  total$ = this.carrinhoService.total$;

  aumentar(item: CarrinhoItem): void {
    this.carrinhoService.updateQuantidade(item.id, item.quantidade + 1);
  }

  diminuir(item: CarrinhoItem): void {
    const novaQtd = item.quantidade - 1;
    if (novaQtd <= 0) {
      this.remover(item);
      return;
    }
    this.carrinhoService.updateQuantidade(item.id, novaQtd);
  }

  remover(item: CarrinhoItem): void {
    this.carrinhoService.remover(item.id);
  }

  limpar(): void {
    this.carrinhoService.limpar();
  }
}
