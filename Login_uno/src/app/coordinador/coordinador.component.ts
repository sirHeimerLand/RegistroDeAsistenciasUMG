import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-coordinador',
  standalone: true,
  templateUrl: './coordinador.component.html',
  styleUrls: ['./coordinador.component.css']
})
export class CoordinadorComponent {
  constructor(private authService: AuthService) {}

  cerrarSesion() {
    this.authService.logout();
  }
}