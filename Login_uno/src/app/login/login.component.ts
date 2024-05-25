import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent {
  nombreUsuario = '';
  contrasena = '';
  mensaje = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.nombreUsuario, this.contrasena).subscribe(
      response => {
        console.log('Respuesta del servidor:', response); // Para depuración

        const body = response.body;
        if (body && body.token && body.rol) {
          // Guardar el token y el rol en el almacenamiento local
          localStorage.setItem('authToken', body.token);
          localStorage.setItem('userRole', body.rol);

          // Redirigir al usuario según su rol
          const userRole = body.rol.toLowerCase();
          if (userRole === 'estudiante') {
            this.router.navigate(['/estudiante']);
          } else if (userRole === 'docente') {
            this.router.navigate(['/docente']);
          } else if (userRole === 'coordinador') {
            this.router.navigate(['/coordinador']);
          }
        }
      },
      error => {
        console.log('Error al iniciar sesión:', error);
        this.mensaje = 'Usuario o contraseña incorrectos';
      }
    );
  }

  navigateToCreateUser() {
    this.router.navigate(['/crear-usuario']);
  }
}
