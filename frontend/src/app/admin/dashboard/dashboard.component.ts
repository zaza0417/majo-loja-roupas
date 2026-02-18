import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  stats = [
    { titulo: 'Vendas hoje', valor: 'R$ 4.200', delta: '+12%' },
    { titulo: 'Pedidos', valor: '38', delta: '+5%' },
    { titulo: 'Ticket médio', valor: 'R$ 220', delta: '+3%' }
  ];
}
