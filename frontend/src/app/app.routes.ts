import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';

import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ContaComponent } from './pages/conta/conta.component';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { ProdutosComponent as AdminProdutosComponent } from './admin/produtos/produtos.component';
import { PedidosComponent as AdminPedidosComponent } from './admin/pedidos/pedidos.component';
import { RelatoriosComponent as AdminRelatoriosComponent } from './admin/relatorios/relatorios.component';
import { UsuariosComponent as AdminUsuariosComponent } from './admin/usuarios/usuarios.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'produtos', component: ProdutosComponent },
      { path: 'carrinho', component: CarrinhoComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'conta', component: ContaComponent, canActivate: [authGuard] }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'produtos', component: AdminProdutosComponent },
      { path: 'pedidos', component: AdminPedidosComponent },
      { path: 'relatorios', component: AdminRelatoriosComponent },
      { path: 'usuarios', component: AdminUsuariosComponent }
    ]
  },
  {
   path: 'login',
    component: LoginComponent
  },
  {
	path: 'register',
	component: RegisterComponent
  },
  { path: '**', redirectTo: '' }
];


