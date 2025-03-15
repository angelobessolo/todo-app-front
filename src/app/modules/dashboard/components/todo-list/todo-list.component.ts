import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrAlertService } from '../../../shared/services/toastr-alert/toastr-alert.service';
import { ThemePalette } from '@angular/material/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FloatButtonComponent } from '../../../shared/components/float-button/float-button.component';
import { FloatButton } from '../../../shared/interfaces/float-button.interface';
import { TaskService } from '../../services/task.service';
import { DocumentData, ResponseTasks, Task } from '../../interfaces/response-tasks.interface';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { GeneralStatus } from '../../../shared/enums/general-status.enum';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FloatButtonComponent,
    MatIconModule,
    MatButtonModule,
    NgxSpinnerModule,
    MatTooltipModule,
    TruncatePipe,
    MatSelectModule
],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
}) 
export class TodoListComponent {
  private taskService = inject(TaskService)
  private spinner = inject(NgxSpinnerService);
  private toastr  = inject(ToastrAlertService);

  color: ThemePalette = 'primary';

  displayedColumns: string[] = [ 
    '#',  
    'Titulo',
    'Descripcion', 
    'Estado', 
  ]; 

  columnMappings: { [key: string]: string } = {
    '#':           'index',
    'Titulo':      'title',
    'Descripcion': 'description',
    'Estado':      'status'
  };

  public buttonActions: FloatButton = {};
  public statusList: string[] = ['Pendiente', 'Completado','Todos'];
  public rowTasks: any[] = [];
  public successAlert: string = 'Eliminación Tarea';
  public dataSource = new MatTableDataSource<any>([]);
  public tasks: Task[] = [];
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  public loadService: boolean = false;
  public showButton: boolean = false;
  public userParams: any;
  public generalStatus = GeneralStatus;
  public titleShowAlert: string = '';

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.userParams = localStorage.getItem('userParams');
    if (this.userParams) {
      const decodedString = atob(this.userParams);
      this.userParams = JSON.parse(decodedString);
    }

    this.getAllTasks();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public filterByStatus(value: any){
    if (value === 'Todos') {
      // Si el valor es 'todos', quitar el filtro
      this.dataSource.filter = '';
    } else {
      // De lo contrario, aplicar el filtro
      this.dataSource.filter = value.trim().toLowerCase();
    }
  
    // Asegurarse de que la paginación esté en la primera página
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public getColumnValue(element: DocumentData, column: string): any {
    const valore = element[this.columnMappings[column] as keyof DocumentData] || ''
    
    return valore;
  }

  public selectedRowList(raw: any){
    raw.selectedRow = ! raw.selectedRow;

    if (raw.selectedRow){
      this.rowTasks.push(raw);
    }else{
      const index = this.rowTasks.findIndex(responsible => responsible._id === raw._id);
      if (index !== -1) {
        this.rowTasks.splice(index, 1);
      }
    }

    if (this.rowTasks.length > 0) {
      this.showButton = true;
    }else {
      this.showButton = false;
    }

    if(this.rowTasks.length > 1){
      this.buttonActions= {
        action: 'none',
        icon: 'widgets',
        label: '',
        color: 'primary',
        subActions: [
          { action: 'changeStatus', 
            icon: 'change_circle', 
            label: 'Cambiar Estado', 
            color: 'primary' 
          },
          { action: 'delete', 
            icon: 'delete', 
            label: 'Eliminar', 
            color: 'primary' 
          },
        ]
      }
    }else{
      this.buttonActions= {
        action: 'none',
        icon: 'widgets',
        label: '',
        color: 'primary',
        subActions: [
          { action: 'view', 
            icon: 'visibility', 
            label: 'Ver', 
            color: 'primary' 
          },
          { action: 'edit', 
            icon: 'edit', 
            label: 'Editar', 
            color: 'primary' 
          },
          { action: 'changeStatus', 
            icon: 'change_circle', 
            label: 'Cambiar Estado', 
            color: 'primary' 
          },
          { action: 'delete', 
            icon: 'delete', 
            label: 'Eliminar', 
            color: 'primary' 
          },
        ]
      }
    }
  }

  public eventAction(event: any){
    
    switch (event.action){
      case 'delete':
        this.deleteTaks();
      break; 

      case 'view':
        this.openViewTask();
      break;

      case 'changeStatus':
        this.changeStatus(this.rowTasks);
      break;

      case 'edit':
        this.openUpdateTask();
      break;

    }
  }

  public openCreateTask(){
    const dialogRef = this.dialog.open(CreateTaskComponent,{
      disableClose: true,
    });
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      // Añadir clase al app-root
      appRoot.classList.add('blur-background'); 
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result.status){
        this.reloadList();
      }
      if (appRoot) {
        // Quitar clase del app-root
        appRoot.classList.remove('blur-background'); 
      }
      
    });
  }

  public openUpdateTask(){
    const dialogRef = this.dialog.open(EditTaskComponent,{
      data: this.rowTasks,
      disableClose: true,
    });
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      // Añadir clase al app-root
      appRoot.classList.add('blur-background'); 
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result.status){
        this.reloadList();
      }
      if (appRoot) {
        // Quitar clase del app-root
        appRoot.classList.remove('blur-background'); 
      }
      
    });
  }

  public openViewTask(){
    const dialogRef = this.dialog.open(ViewTaskComponent,{
      data: this.rowTasks,
      disableClose: true,
    });
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      // Añadir clase al app-root
      appRoot.classList.add('blur-background'); 
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result.status){
        this.reloadList();
      }
      if (appRoot) {
        // Quitar clase del app-root
        appRoot.classList.remove('blur-background'); 
      }
      
    });
  }

  // Inicializa variables y recarga tabla
  public reloadList(): void{
    this.dataSource.data = [];
    this.tasks = [];
    this.showButton = false;
    this.rowTasks = [];
    this.loadService = false;
    this.rowTasks = [];
    this.getAllTasks();
  }

  // Elimina tareas seleccionadas
  public deleteTaks(){
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

      const deleteIds = this.rowTasks.map((task) => task.id);

      this.taskService.deleteTasks(deleteIds).subscribe({
        next: (response: any) => {
          this.spinner.hide();

          if (appRoot) {
            // Añadir clase al app-root
            appRoot.classList.add('blur-background'); 
          }

          if (response.statusCode === 200) {
            this.reloadList();
            const message = response.message;
            this.toastr.showSucces(this.successAlert, message);
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

  // Obtiene todas las tareas para el usuario logueado
  public getAllTasks(){
    setTimeout(() =>{
      this.taskService.getTasks(this.userParams.user.id).subscribe({
        next: (response: ResponseTasks) => {
          this.tasks = response.data.tasks;
          const data = this.tasks.map((task: Task, index) => ({
            index:           index + 1,     
            id:              task.id,
            title:           task.title,
            description:     task.description,
            status:          task.status,
            selectedRow:     false,
            createAt:        task.createAt,
            updateAt:        task.updateAt
          })); 
      
          this.dataSource.data = data;

          // Después de un tiempo, reiniciar el paginator y sort
          setTimeout(() => {
            // Reiniciar el índice de la página (página 1)
            if (this.paginator) {
              this.paginator.pageIndex = 0;
            }

            // Reiniciar el sort (sin ninguna columna seleccionada)
            if (this.sort) {
              this.sort.sort({ id: '', start: 'asc', disableClear: false });
            }

            // Asignar nuevamente el paginator y el sort a la dataSource
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, 500);
          
          this.loadService = true;
          
        },
        error: err => {
          const title = 'Eliminacion Responsable';
          const message = err.message;
          this.toastr.showError(title, message);
        }
      })
    }, 500);
  }
  
  // Cambia estado de la tarea
  public changeStatus(rowTasks: any[]): void{
    this.spinner.show();
    setTimeout(() =>{
      rowTasks.forEach((task: any) => {
        const statusTaskValue = task.status === this.generalStatus.Completado ? this.generalStatus.Pendiente : this.generalStatus.Completado
    
        const dataTaskUpdate = {
          title: task.title,
          description: task.description,
          status: statusTaskValue,
        }
        
        this.taskService.updateTask(task.id, dataTaskUpdate).subscribe({
          next: (response: any) => {
            this.spinner.hide();

            if (response.statusCode === 200) {
              this.titleShowAlert = 'Cambio Estado Tarea';
              const message = response.message;
              this.toastr.showSucces(this.titleShowAlert, message);
            }
            
          },
          error: err => {
            this.spinner.hide();

            this.titleShowAlert = 'Cambio Estado Estudiante';
            const message = err.error.message;
  
            message.forEach((element: any) => {
              this.toastr.showError(this.titleShowAlert, element);
            });
          }
        })
      });
      this.reloadList();
    }, 500);
  }
}
