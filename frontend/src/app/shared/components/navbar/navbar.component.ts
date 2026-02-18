import { Component, DestroyRef, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CarrinhoService } from '../../../core/services/carrinho.service';
import { AuthService } from '../../../core/services/auth.service';
import { Me, MeService } from '../../../core/services/me.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private carrinhoService = inject(CarrinhoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private meService = inject(MeService);
  private destroyRef = inject(DestroyRef);
  private elRef = inject(ElementRef<HTMLElement>);

  totalItens$ = this.carrinhoService.totalQuantidade$;

  menuOpen = false;
  me: Me | null = null;

  ngOnInit(): void {
    this.meService.me$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(me => (this.me = me));

    if (this.isAuthenticated) {
      this.meService.load().subscribe();
    }
  }

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  get isAdmin(): boolean {
    return (this.auth.getRole() ?? '').includes('ADMIN');
  }

  get displayName(): string {
    const base = (this.me?.nome ?? this.emailLabel ?? '').trim();
    if (!base) return 'Conta';
    return base;
  }

  get initials(): string {
    const base = this.displayName.trim();
    if (!base) return 'IS';

    const parts = base.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts.length > 1 ? (parts[1]?.[0] ?? '') : (parts[0]?.[1] ?? '');
    const initials = (first + second).toUpperCase();
    return initials || 'IS';
  }

  private get emailLabel(): string | null {
    const email = this.auth.getEmail();
    if (!email) return null;
    const local = email.split('@')[0] ?? '';
    return local ? local.charAt(0).toUpperCase() + local.slice(1) : null;
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen) return;

    const target = event.target as Node | null;
    if (!target) return;

    if (!this.elRef.nativeElement.contains(target)) {
      this.menuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.closeMenu();
    this.auth.clearToken();
    this.meService.clear();
    this.router.navigate(['/']);
  }
}
