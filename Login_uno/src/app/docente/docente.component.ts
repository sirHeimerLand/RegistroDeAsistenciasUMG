import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-docente',
  standalone: true,
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.css']
})
export class DocenteComponent {
  constructor(private authService: AuthService) {}

  cerrarSesion() {
    this.authService.logout();
  }
}