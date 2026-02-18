import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Me {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export interface UpdateMeRequest {
  nome: string;
  senhaAtual?: string;
  novaSenha?: string;
}

@Injectable({ providedIn: 'root' })
export class MeService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private readonly API = `${environment.apiUrl}/api/me`;

  private meSubject = new BehaviorSubject<Me | null>(null);
  me$ = this.meSubject.asObservable();

  load(force = false): Observable<Me | null> {
    if (!isPlatformBrowser(this.platformId)) return of(null);

    const current = this.meSubject.value;
    if (current && !force) return of(current);

    return this.http.get<Me>(this.API).pipe(tap(me => this.meSubject.next(me)));
  }

  update(data: UpdateMeRequest): Observable<Me> {
    return this.http.put<Me>(this.API, data).pipe(tap(me => this.meSubject.next(me)));
  }

  clear(): void {
    this.meSubject.next(null);
  }
}

