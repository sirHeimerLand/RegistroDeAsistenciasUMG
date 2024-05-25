// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EstudianteComponent } from './estudiante/estudiante.component';
import { DocenteComponent } from './docente/docente.component';
import { CoordinadorComponent } from './coordinador/coordinador.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'crear-usuario', component: CrearUsuarioComponent },
  { path: 'estudiante', component: EstudianteComponent, canActivate: [AuthGuard], data: { role: 'estudiante' }},
  { path: 'docente', component: DocenteComponent, canActivate: [AuthGuard], data: { role: 'docente' }},
  { path: 'coordinador', component: CoordinadorComponent, canActivate: [AuthGuard], data: { role: 'coordinador' }},
];
