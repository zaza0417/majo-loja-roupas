import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminPedido {
  id: number;
  clienteNome: string;
  clienteEmail: string;
  enderecoRua: string;
  enderecoCidade: string;
  enderecoEstado: string;
  enderecoCep: string;
  total: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  checkoutUrl: string;
  criadoEm: string;
  itens: Array<{
    id: number;
    produtoId: number;
    nome: string;
    precoUnitario: number;
    quantidade: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class AdminPedidoService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/admin/pedidos`;

  listar(): Observable<AdminPedido[]> {
    return this.http.get<AdminPedido[]>(this.API);
  }

  atualizarStatus(id: number, status: AdminPedido['status']): Observable<AdminPedido> {
    return this.http.patch<AdminPedido>(`${this.API}/${id}/status`, null, {
      params: { status }
    });
  }
}
