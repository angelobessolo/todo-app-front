import { CommonModule } from '@angular/common';
import { Component, computed, Inject, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TaskService } from '../../services/task.service';
import { ToastrAlertService } from '../../../shared/services/toastr-alert/toastr-alert.service';

@Component({
  selector: 'app-edit-task',
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
    MatDatepickerModule,
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent {
  private taskService = inject(TaskService);
  private spinner     = inject(NgxSpinnerService);
  private toastr      = inject(ToastrAlertService);
    
  @ViewChildren('formFieldRef') formFieldRefs: QueryList<MatFormField> | undefined;
  
  private formBuilder = inject(FormBuilder);
  public createTaskForm!: FormGroup;
  public successAlert: string = 'Actualización Tarea';
  public statusList: string[] = ['Pendiente', 'Completado'];
  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly _intl = inject(MatDatepickerIntl);
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));
  public task!: any;
  public errorMessage: string = '';

  readonly dateFormatString = computed(() => {
    if (this._locale() === 'es-ES') {
      return 'DD/MM/AAAA';
    } else {
      return 'MM/DD/YYYY';
    }
    return '';
  });
    
  constructor(
    private dialogRef: MatDialogRef<EditTaskComponent>,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DATE_LOCALE) private locale: string,
  ) {
    this.adapter.setLocale('es');
  }
    
  ngOnInit(): void {
    this.task = this.data[0];

    // Aquí instanciamos el formulario y definimos los controles 
    this.createTaskForm = this.formBuilder.group({
      title:       [this.task.title, Validators.required],
      description: [this.task.description, Validators.required],
      status:      [this.task.status, Validators.required],
      createAt:    [new Date(this.task.createAt)],        
      updateAt:    [new Date(this.task.updateAt)],  
    });
  }
  
  ngAfterViewInit() {
    // Aquí nos aseguramos de que formFieldRef esté disponible para cambiar el background
    if (this.formFieldRefs) {
      this.formFieldRefs.toArray().forEach(formField => {
        this.setReadOnlyFields(formField);
      });
    }
  }
  
  // Setea clase para solo lectura de fields
  public setReadOnlyFields(formField: MatFormField) {
    // Verificamos que formField esté definido antes de acceder a su propiedad
    const formFieldElement = formField?._elementRef.nativeElement;
    
    // Buscar el div hijo que envuelve el campo
    const inputContainer = formFieldElement.querySelector('.mat-mdc-text-field-wrapper');
    
    if (inputContainer) {
      inputContainer.classList.add('readonly-fields');
    }
  }

  // Actualiza tarea
  public updateTask(): void {
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
      const dataTaskUpdate = {
        title: sendForm.title,
        description: sendForm.description,
        status: sendForm.status,
      }

      this.taskService.updateTask(this.task.id, dataTaskUpdate).subscribe({
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

  // Cierra modal
  closeDialog(): void {
    this.dialogRef.close({
      status: false,
      data: {}
    });
  }

  // Validaciones personalizadas del formulario
  public updateErrorMessage(fieldName: string) {
    let control = this.createTaskForm.get(fieldName);

    if (!control){
      control = this.createTaskForm.get(fieldName);
    } 
    
    if(!control) return;

    // Obtener el valor del campo del formulario
    const fieldValue = control.value; 

    this.errorMessage = '';
    switch (fieldName){
      case 'title':  
        if (control.touched && control.hasError('required') && fieldValue == '') {
          this.errorMessage = `Campo debe ser diligenciado`;
        }
      break;

      case 'description':  
        if (control.touched && control.hasError('required') && fieldValue == '') {
          this.errorMessage = `Campo debe ser diligenciado`;
        }
      break;
    }
  }
}
