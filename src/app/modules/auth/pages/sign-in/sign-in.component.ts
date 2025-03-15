import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrAlertService } from '../../../shared/services/toastr-alert/toastr-alert.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,  
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  private formBuilder = inject(FormBuilder);
  private router      = inject(Router);
  private authService = inject(AuthService);
  private toastr      = inject(ToastrAlertService);
  private spinner     = inject(NgxSpinnerService);

  @ViewChild('container')
  public container!: ElementRef;
  public rotationState = 'start';
  public animationFrame: any;
  public hide = true;
  public errorMessage = '';
  public flipped: boolean = false;
  public titleShowAlert: string = '';

  // Variables de formulario login
  public loginForm = this.formBuilder.group({
    email: ['admin@gmail.com', [Validators.required]],
    password: ['admin123--', [Validators.required, Validators.minLength(8)]],
  });

  // Variables de formulario registro
  public signupForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    userName: ['', [Validators.required]],
  });

  public loopAnimation(): void {
    this.rotationState = this.rotationState === 'start' ? 'end' : 'start';
    setTimeout(() => {
      this.loopAnimation();
    }, 500);
  }

  // Eliminar clase 
  public signIn() {
    this.container.nativeElement.classList.remove('right-panel-active');
  } 

  // Agregar clase
  public signUp() {
    this.container.nativeElement.classList.add('right-panel-active');
  }

  // Validaciones personalizadas del formulario
  public updateErrorMessage(fieldName: string) {
    let control = this.loginForm.get(fieldName);

    if (!control){
      control = this.signupForm.get(fieldName);
    } 
    
    if(!control) return;

    // Obtener el valor del campo del formulario
    const fieldValue = control.value; 

    this.errorMessage = '';
    switch (fieldName){
      case 'email':  
        // if (control.touched && control.hasError('required') && fieldValue == '') {
        //   this.errorMessage = `Campo debe ser diligenciado`;
        // } else if (control.touched && control.hasError('pattern')) {
        //   this.errorMessage = 'Campo no cumple con el patron, debe tener una estructura: example@example.example';
        // } else {
        //   this.errorMessage = '';
        // }
      break;

      case 'password':  
        if (control.touched && fieldValue == '') {
          this.errorMessage = `Campo debe ser diligenciado`;
        } else if (control.touched  && fieldValue.length < 8) {
          this.errorMessage = 'Longitud de contraseña debe ser mayor a 8 caracteres';
          control.setErrors({ invalid: true }); // Marcar el campo como inválido
        } else {
          this.errorMessage = '';
        }
      break;
    }
  }

  // Getter email
  get email() {
    return this.loginForm.get('email');
  }

  // Getter contraseña
  get password() {
    return this.loginForm.get('password');
  }

  // Login de sesion
  public submitForm(): void{
    const {email, password} = this.loginForm.value;

    if(email && password){
      this.spinner.show();
      setTimeout(() => { 
        this.authService.login(email, password).subscribe({
          // Redirecciona a el dashboard si la autenticación es valida
          next: (response) => {
            this.spinner.hide();
            this.toastr.showSucces('Inicio Sesión', 'Usuario Logueado Exitosamente');
            this.router.navigateByUrl('/dashboard');
            
          },
          // Levanta alerta de error al usuario
          error: (response) => {
            this.spinner.hide();
            const title = 'Inicio Sesión';
            const message = response.error.message
            this.toastr.showError(title, message);
          } 
        })
      }, 500);
    } 
  }

  // Registro de usuario
  public signUpSubmitForm(): void{ 
    if(this.signupForm.valid){
      this.spinner.show();
      setTimeout(() => { 
        this.authService.signUp(this.signupForm.value).subscribe({
          // Redirecciona a el dashboard si la autenticación es valida
          next: (response) => {
            this.spinner.hide();

            // Limpia el formulario
            this.signupForm.reset();

            // Genera alerta de confirmacón
            this.toastr.showSucces('Registro Usuario', 'Usuario Creado Exitosamente');

            // Voltea la terjeta para hacer login
            this.flipCard();
            
          },
          // Levanta alerta de error al usuario
          error: (response) => {
            this.spinner.hide();
            this.titleShowAlert = 'Registro Usuario';
            const message = response.error.message
            this.toastr.showError(this.titleShowAlert, message);
          } 
        })
      }, 500);
    } 
  }

  // Gira card
  flipCard() {
    this.flipped = !this.flipped;
  }

  // Cambia visibilidad de contraseña
  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  // Validación de espacios
  public noSpacesRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value || value.length === 0 || value.length < 3) {
        return { requiredSpaces: true }; // Error si está vacío o solo tiene espacios
      }
      return null; // Sin error
    };
  }

}
