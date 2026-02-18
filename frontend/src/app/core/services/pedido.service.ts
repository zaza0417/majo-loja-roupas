import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CarrinhoItem } from './carrinho.service';

export interface CheckoutPayload {
  nome: string;
  email: string;
  enderecoRua: string;
  cidade: string;
  estado: string;
  cep: string;
  itens: Array<{
    produtoId: number;
    nome: string;
    preco: number;
    quantidade: number;
  }>;
  returnUrl?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  pedidoId: number;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/api/checkout/shopify`;

  checkout(payload: CheckoutPayload): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(this.API, payload);
  }

  toPayload(nome: string, email: string, endereco: any, itens: CarrinhoItem[], returnUrl?: string): CheckoutPayload {
    return {
      nome,
      email,
      enderecoRua: endereco.endereco,
      cidade: endereco.cidade,
      estado: endereco.estado,
      cep: endereco.cep,
      itens: itens.map(i => ({
        produtoId: i.id,
        nome: i.nome,
        preco: i.preco,
        quantidade: i.quantidade
      })),
      returnUrl
    };
  }
}
