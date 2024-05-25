import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-estudiante',
  standalone: true,
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent {
  constructor(private authService: AuthService) {}

  cerrarSesion() {
    this.authService.logout();
  }
}