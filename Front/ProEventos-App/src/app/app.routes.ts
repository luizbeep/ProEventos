import { Routes } from '@angular/router';
import { Eventos } from './components/eventos/eventos';
import { Artistas } from './components/artistas/artistas';
import { ContatosComponent } from './components/contatos/contatos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/perfil/perfil.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'eventos', component: Eventos },
  { path: 'artistas', component: Artistas },
  { path: 'contatos', component: ContatosComponent },
  { path: 'perfil', component: PerfilComponent },
];
