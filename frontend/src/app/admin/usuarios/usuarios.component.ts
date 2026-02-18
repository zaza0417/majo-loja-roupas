import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminUsuario, AdminUsuarioService } from '../../core/services/admin-usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  private service = inject(AdminUsuarioService);
  private fb = inject(FormBuilder);

  usuarios: AdminUsuario[] = [];
  loading = true;
  saving = false;
  error: string | null = null;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    role: ['USER', Validators.required]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível carregar os usuários.';
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const value = this.form.getRawValue() as any;
    this.service.criar(value).subscribe({
      next: () => {
        this.saving = false;
        this.form.reset({ role: 'USER' });
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error || 'Erro ao criar usuário.';
      }
    });
  }
}

