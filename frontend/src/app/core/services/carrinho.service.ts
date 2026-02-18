import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CarrinhoItem {
  id: number;
  nome: string;
  preco: number;
  imagem?: string;
  quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly STORAGE_KEY = 'izzy_cart';

  private itemsSubject = new BehaviorSubject<CarrinhoItem[]>(this.carregarStorage());
  items$ = this.itemsSubject.asObservable();

  total$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.preco * item.quantidade, 0))
  );

  totalQuantidade$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantidade, 0))
  );

  addItem(produto: { id: number; nome: string; preco: number; imagem?: string }, quantidade = 1): void {
    const items = [...this.itemsSubject.value];
    const index = items.findIndex(i => i.id === produto.id);

    if (index >= 0) {
      items[index] = { ...items[index], quantidade: items[index].quantidade + quantidade };
    } else {
      items.push({ ...produto, quantidade });
    }

    this.update(items);
  }

  updateQuantidade(id: number, quantidade: number): void {
    const items = this.itemsSubject.value
      .map(item => item.id === id ? { ...item, quantidade } : item)
      .filter(item => item.quantidade > 0);

    this.update(items);
  }

  remover(id: number): void {
    const items = this.itemsSubject.value.filter(item => item.id !== id);
    this.update(items);
  }

  limpar(): void {
    this.update([]);
  }

  snapshot(): CarrinhoItem[] {
    return this.itemsSubject.value;
  }

  private update(items: CarrinhoItem[]): void {
    this.itemsSubject.next(items);
    this.salvarStorage(items);
  }

  private carregarStorage(): CarrinhoItem[] {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(this.STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private salvarStorage(items: CarrinhoItem[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // storage pode falhar (modo privado); apenas ignore
    }
  }
}
