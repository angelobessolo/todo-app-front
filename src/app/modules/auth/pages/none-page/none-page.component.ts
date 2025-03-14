import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthStatus } from '../../interfaces/auth-status.enum';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-none-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule, 
  ],
  templateUrl: './none-page.component.html',
  styleUrl: './none-page.component.css'
})
export class NonePageComponent {
  
  // Inyecta los servicios
  authService = inject(AuthService);
  router = inject(Router);

  // Metodo que valida en page 404 el status del usuario para redirigir con el boton
  public validateRedirectPath(){
    if (this.authService.authStatus() === AuthStatus.authenticated) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/auth');
    }
  }
}
