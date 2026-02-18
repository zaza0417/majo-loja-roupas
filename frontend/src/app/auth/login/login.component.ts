import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.login(this.form.value as any).subscribe({
      next: () => {
        this.loading = false;
        const redirectParam = this.route.snapshot.queryParamMap.get('redirect');
        const role = this.authService.getRole();
        const fallback = role && role.includes('ADMIN') ? '/admin/dashboard' : '/conta';
        const redirect = redirectParam ?? fallback;
        this.router.navigateByUrl(redirect);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error || 'Falha ao fazer login. Verifique seus dados.';
      },
    });
  }
}
