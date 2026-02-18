import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPedidoService, AdminPedido } from '../../core/services/admin-pedido.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {
  private service = inject(AdminPedidoService);

  pedidos: AdminPedido[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.listar().subscribe({
      next: (data) => { this.pedidos = data; this.loading = false; },
      error: () => { this.error = 'Não foi possível carregar os pedidos'; this.loading = false; }
    });
  }

  setStatus(pedido: AdminPedido, status: string): void {
    if (status !== 'PENDING' && status !== 'PAID' && status !== 'CANCELLED') {
      this.error = 'Status inválido';
      return;
    }

    this.service.atualizarStatus(pedido.id, status).subscribe({
      next: (p) => { pedido.status = p.status; },
      error: () => { this.error = 'Erro ao atualizar status'; }
    });
  }
}
