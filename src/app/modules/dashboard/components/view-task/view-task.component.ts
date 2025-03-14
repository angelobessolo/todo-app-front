import { CommonModule } from '@angular/common';
import { Component, computed, Inject, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TaskService } from '../../services/task.service';
import { ToastrAlertService } from '../../../shared/services/toastr-alert/toastr-alert.service';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-view-task',
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
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css'
})
export class ViewTaskComponent {
  private taskService = inject(TaskService);
  private spinner     = inject(NgxSpinnerService);
  private toastr      = inject(ToastrAlertService);
  
  @ViewChildren('formFieldRef') formFieldRefs: QueryList<MatFormField> | undefined;

  private formBuilder = inject(FormBuilder);
  createTaskForm!: FormGroup;

  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly _intl = inject(MatDatepickerIntl);
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));
  
  readonly dateFormatString = computed(() => {
    if (this._locale() === 'es-ES') {
      return 'DD/MM/AAAA';
    } else {
      return 'MM/DD/YYYY';
    }
    return '';
  });
  
  public documentType!: [];
  public cordinations!: any[];
  public task!: any;
  flgCreateUser = false;
  
  selectedConcept: number | null = null;
  customConcept: string = '';
  isOtherConceptSelected: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ViewTaskComponent>,
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
    // Aquí nos aseguramos de que formFieldRef esté disponible
    // Asegurarse de que formFieldRefs tenga contenido
    if (this.formFieldRefs) {
      this.formFieldRefs.toArray().forEach(formField => {
        this.setReadOnlyFields(formField);
      });
    }
  }

  public setReadOnlyFields(formField: MatFormField) {
    // Verificamos que formField esté definido antes de acceder a su propiedad
    const formFieldElement = formField?._elementRef.nativeElement;
    
    // Buscar el div hijo que envuelve el campo
    const inputContainer = formFieldElement.querySelector('.mat-mdc-text-field-wrapper');
    
    if (inputContainer) {
      // inputContainer.classList.remove('default-readonly-fields');
      inputContainer.classList.add('readonly-fields');
    }
  }

  closeDialog(): void {
    this.dialogRef.close({
      status: false,
      data: {}
    });
  }
  
}
