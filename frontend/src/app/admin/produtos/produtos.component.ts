import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProdutoService, Produto } from '../../core/services/produto.service';

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit, OnDestroy {
  private produtoService = inject(ProdutoService);
  private fb = inject(FormBuilder);

  produtos: Produto[] = [];
  loading = true;
  saving = false;
  error: string | null = null;
  editingId: number | null = null;
  imagemFile: File | null = null;
  imagemPreviewUrl: string | null = null;
  private objectUrl: string | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    preco: [0, Validators.required],
    estoque: [0, Validators.required],
    categoria: [''],
    ativo: [true]
  });

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  load(): void {
    this.loading = true;
    this.produtoService.adminList().subscribe({
      next: (produtos) => { this.produtos = produtos; this.loading = false; },
      error: () => { this.error = 'Não foi possível carregar os produtos.'; this.loading = false; }
    });
  }

  edit(produto: Produto): void {
    this.editingId = produto.id;
    this.form.patchValue({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      estoque: produto.estoque,
      categoria: produto.categoria ?? '',
      ativo: produto.ativo
    });
    this.revokeObjectUrl();
    this.imagemFile = null;
    this.imagemPreviewUrl = produto.imagem ?? null;
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({ ativo: true, preco: 0, estoque: 0 });
    this.revokeObjectUrl();
    this.imagemFile = null;
    this.imagemPreviewUrl = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    if (!file) return;

    this.imagemFile = file;
    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.imagemPreviewUrl = this.objectUrl;
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const values = this.form.getRawValue() as any;
    const payload = new FormData();
    payload.append('nome', values.nome ?? '');
    payload.append('descricao', values.descricao ?? '');
    payload.append('preco', String(values.preco ?? 0));
    payload.append('estoque', String(values.estoque ?? 0));
    payload.append('ativo', String(values.ativo ?? true));
    if (values.categoria) {
      payload.append('categoria', values.categoria);
    }
    if (this.imagemFile) {
      payload.append('imagem', this.imagemFile, this.imagemFile.name);
    }

    const obs = this.editingId
      ? this.produtoService.atualizar(this.editingId, payload)
      : this.produtoService.criar(payload);

    obs.subscribe({
      next: () => { this.saving = false; this.resetForm(); this.load(); },
      error: () => { this.error = 'Erro ao salvar produto'; this.saving = false; }
    });
  }

  remover(id: number): void {
    if (!confirm('Remover produto?')) return;
    this.produtoService.remover(id).subscribe({
      next: () => this.load(),
      error: () => this.error = 'Erro ao remover produto'
    });
  }
}
