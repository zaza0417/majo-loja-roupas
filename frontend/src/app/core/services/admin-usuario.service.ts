import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUsuario {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export interface AdminCreateUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  role: 'USER' | 'ADMIN';
}

@Injectable({ providedIn: 'root' })
export class AdminUsuarioService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/admin/usuarios`;

  listar(): Observable<AdminUsuario[]> {
    return this.http.get<AdminUsuario[]>(this.API);
  }

  criar(payload: AdminCreateUsuarioRequest): Observable<AdminUsuario> {
    return this.http.post<AdminUsuario>(this.API, payload);
  }
}

