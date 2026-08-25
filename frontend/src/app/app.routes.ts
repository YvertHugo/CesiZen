import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { InformationsComponent } from './pages/informations/informations';
import { RespirationComponent } from './pages/respiration/respiration';
import { ProfilComponent } from './pages/profil/profil';
import { AdminComponent } from './pages/admin/admin';

export const routes: Routes = [
  // Redirection par défaut vers la page de connexion
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Nos deux pages
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'informations', component: InformationsComponent },
  { path: 'respiration', component: RespirationComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'admin', component: AdminComponent }
];