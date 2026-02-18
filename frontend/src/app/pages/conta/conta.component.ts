import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Me, MeService, UpdateMeRequest } from '../../core/services/me.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-conta',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './conta.component.html',
  styleUrl: './conta.component.scss'
})
export class ContaComponent implements OnInit {
  private auth = inject(AuthService);
  private meService = inject(MeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  me: Me | null = null;
  loading = true;
  error: string | null = null;

  saving = false;
  success: string | null = null;
  formError: string | null = null;
  editMode = false;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    senhaAtual: [''],
    novaSenha: [''],
    confirmarNovaSenha: ['']
  });

  ngOnInit(): void {
    this.meService.me$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(me => {
        this.me = me;
        if (me?.nome) {
          this.form.patchValue({ nome: me.nome });
        }
      });

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.editMode = params.get('edit') === '1';
      });

    this.meService.load(true).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Não foi possível carregar sua conta. Tente novamente.';
      }
    });
  }

  get email(): string {
    return this.me?.email ?? this.auth.getEmail() ?? '—';
  }

  get role(): string {
    return this.me?.role ?? this.auth.getRole() ?? '—';
  }

  get isAdmin(): boolean {
    return (this.role ?? '').includes('ADMIN');
  }

  abrirEdicao(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { edit: 1 },
      queryParamsHandling: 'merge'
    });
  }

  cancelarEdicao(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { edit: null },
      queryParamsHandling: 'merge'
    });
    this.resetForm();
  }

  resetForm(): void {
    this.success = null;
    this.formError = null;
    this.form.reset({
      nome: this.me?.nome ?? '',
      senhaAtual: '',
      novaSenha: '',
      confirmarNovaSenha: ''
    });
  }

  salvar(): void {
    this.success = null;
    this.formError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formError = 'Confira os campos e tente novamente.';
      return;
    }

    const nome = (this.form.value.nome ?? '').trim();
    const senhaAtual = (this.form.value.senhaAtual ?? '').trim();
    const novaSenha = (this.form.value.novaSenha ?? '').trim();
    const confirmar = (this.form.value.confirmarNovaSenha ?? '').trim();

    const wantsPasswordChange = !!(senhaAtual || novaSenha || confirmar);
    if (wantsPasswordChange) {
      if (!senhaAtual) {
        this.formError = 'Informe sua senha atual para alterar a senha.';
        return;
      }
      if (!novaSenha) {
        this.formError = 'Informe a nova senha.';
        return;
      }
      if (novaSenha.length < 6) {
        this.formError = 'A nova senha deve ter pelo menos 6 caracteres.';
        return;
      }
      if (novaSenha !== confirmar) {
        this.formError = 'A confirmação da nova senha não confere.';
        return;
      }
    }

    const payload: UpdateMeRequest = { nome };
    if (wantsPasswordChange) {
      payload.senhaAtual = senhaAtual;
      payload.novaSenha = novaSenha;
    }

    this.saving = true;
    this.meService.update(payload).subscribe({
      next: () => {
        this.saving = false;
        this.success = 'Perfil atualizado com sucesso.';
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { edit: null },
          queryParamsHandling: 'merge'
        });
        this.form.patchValue({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });
      },
      error: (err) => {
        this.saving = false;
        this.formError = err?.error?.message ?? 'Não foi possível salvar. Verifique sua senha atual.';
      }
    });
  }

  logout(): void {
    this.auth.clearToken();
    this.meService.clear();
    this.router.navigate(['/']);
  }
}
