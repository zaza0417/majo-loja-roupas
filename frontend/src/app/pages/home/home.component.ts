import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProdutoService, Produto } from '../../core/services/produto.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private auth = inject(AuthService);

  produtos: Produto[] = [];

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  ngOnInit(): void {
    this.produtoService.listar().subscribe(produtos => {
      this.produtos = produtos.slice(0, 4);
    });
  }
}
