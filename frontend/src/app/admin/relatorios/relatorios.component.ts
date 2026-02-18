import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent {
  cards = [
    { title: 'Conversão', value: '3,4%', desc: 'Sessões que viraram pedidos' },
    { title: 'Ticket médio', value: 'R$ 218', desc: 'Média dos pedidos pagos' },
    { title: 'CAC estimado', value: 'R$ 42', desc: 'Custo aquisição por pedido' }
  ];
}
