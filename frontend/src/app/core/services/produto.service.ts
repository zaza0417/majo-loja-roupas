import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria?: string;
  imagem?: string;
  ativo: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/api/produtos`;
  private readonly ADMIN_API = `${environment.apiUrl}/admin/produtos`;

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API);
  }

  buscar(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.API}/${id}`);
  }

  adminList(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.ADMIN_API);
  }

  criar(data: FormData): Observable<Produto> {
    return this.http.post<Produto>(this.ADMIN_API, data);
  }

  atualizar(id: number, data: FormData): Observable<Produto> {
    return this.http.put<Produto>(`${this.ADMIN_API}/${id}`, data);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ADMIN_API}/${id}`);
  }
}
