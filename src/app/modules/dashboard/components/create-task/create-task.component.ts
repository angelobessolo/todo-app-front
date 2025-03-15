import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TaskService } from '../../services/task.service';
import { ToastrAlertService } from '../../../shared/services/toastr-alert/toastr-alert.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    CommonModule, 
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDialogActions,
    NgxSpinnerModule, 
    MatSlideToggleModule,
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  private taskService = inject(TaskService);
  private spinner     = inject(NgxSpinnerService);
  private toastr      = inject(ToastrAlertService);

  private formBuilder = inject(FormBuilder);
  public createTaskForm!: FormGroup;
  public successAlert: string = 'Creación Tarea';

  constructor(
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string,
  ) {
    this.adapter.setLocale('es');
  }
  
  ngOnInit(): void {
    // Aquí instanciamos el formulario y definimos los controles 
    this.createTaskForm = this.formBuilder.group({
      title:       ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  // Cerrar modal
  public closeDialog(): void {
    this.dialogRef.close({
      status: false,
      data: {}
    });
  }
  
  // Crear tarea
  public createTask(): void {
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      // Quitar clase del app-root
      appRoot.classList.remove('blur-background'); 
    }

    this.spinner.show();
    setTimeout(() => {
      if (appRoot) {
        // Añadir clase al app-root
        appRoot.classList.remove('blur-background'); 
      }

      const sendForm = this.createTaskForm.value;

      this.taskService.createTask(sendForm).subscribe({
        next: (response: any) => {
          this.spinner.hide();

          if (appRoot) {
            // Añadir clase al app-root
            appRoot.classList.add('blur-background'); 
          }

          if (response.statusCode === 200) {
            const message = response.message;
            this.toastr.showSucces(this.successAlert, message);
            this.dialogRef.close({
              status: true,
              data: response
            });
          }
        },
        error: err => {
          console.log(err);
          this.spinner.hide();

          if (appRoot) {
            // Añadir clase al app-root
            appRoot.classList.add('blur-background'); 
          }
          
          const message = err.error.message;

          message.forEach((element: any) => {
            this.toastr.showError(this.successAlert, element);
          });
        }
      })
    }, 
    500
    );
  }
}
