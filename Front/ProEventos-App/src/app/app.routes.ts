import { Routes } from '@angular/router';
import { EventoLista } from './components/eventos/evento-lista/evento-lista';
import { Artistas } from './components/artistas/artistas';
import { ContatosComponent } from './components/contatos/contatos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { Eventos } from './components/eventos/eventos';
import { EventoDetalhe } from './components/eventos/evento-detalhe/evento-detalhe';
import { User } from './components/user/user';
import { Login } from './components/user/login/login';
import { Registration } from './components/user/registration/registration';
import { AuthGuard } from './guard/auth-guard';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'artistas', component: Artistas },
  { path: 'contatos', component: ContatosComponent },

  {
    path: 'user',
    component: User,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // 👈 aqui
      { path: 'login', component: Login },
      { path: 'registration', component: Registration },
      { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] }
    ]
  },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [

      { path: 'dashboard', component: DashboardComponent },

      {
        path: 'eventos',
        component: Eventos,
        children: [
          { path: 'lista', component: EventoLista },
          { path: 'detalhe', component: EventoDetalhe },
          { path: 'detalhe/:id', component: EventoDetalhe }
        ]
      }

    ]
  }

];
