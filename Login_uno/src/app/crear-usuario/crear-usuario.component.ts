import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css'],
  providers: [AuthService]
})
export class CrearUsuarioComponent {
  nombreUsuario = '';
  contrasena = '';
  confirmarContrasena = '';
  rol = '';
  numeroTelefono = '';
  showPassword = false;
  mensaje = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.contrasena !== this.confirmarContrasena) {
      this.mensaje = 'Las contraseñas no coinciden.';
      return;
    }

    if (!this.validatePassword(this.contrasena)) {
      this.mensaje = 'La contraseña no cumple con los requisitos.';
      return;
    }

    const nuevoUsuario = {
      NombreUsuario: this.nombreUsuario,
      Contrasena: this.contrasena,
      Rol: this.rol,
      NumeroTelefono: this.numeroTelefono
    };

    this.authService.crearUsuario(nuevoUsuario).subscribe(response => {
      this.mensaje = 'Usuario creado exitosamente';
      this.router.navigate(['/login']);
    }, error => {
      this.mensaje = 'Error al crear el usuario';
    });
  }

  validatePassword(password: string): boolean {
    const pattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return pattern.test(password);
  }

  regresarALogin() {
    this.router.navigate(['/login']);
  }
}
