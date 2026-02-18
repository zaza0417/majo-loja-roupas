import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { PedidoService } from '../../core/services/pedido.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  carrinhoService = inject(CarrinhoService);
  pedidoService = inject(PedidoService);
  router = inject(Router);

  total$ = this.carrinhoService.total$;
  loading = false;
  error: string | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    endereco: ['', Validators.required],
    cidade: ['', Validators.required],
    estado: ['', Validators.required],
    cep: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const endereco = this.form.value;
    const itens = this.carrinhoService.snapshot();

    if (!itens.length) {
      this.error = 'Seu carrinho está vazio.';
      this.loading = false;
      return;
    }

    const payload = this.pedidoService.toPayload(
      endereco!.nome!,
      endereco!.email!,
      endereco!,
      itens,
      typeof window !== 'undefined' ? window.location.origin + '/checkout' : undefined
    );

    this.pedidoService.checkout(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.carrinhoService.limpar();
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Não foi possível concluir o checkout agora. Tente novamente.';
      }
    });
  }
}

