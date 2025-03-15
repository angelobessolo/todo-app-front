import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { ResponseTasks } from '../interfaces/response-tasks.interface';
import { GeneralStatus } from '../../shared/enums/general-status.enum';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly baseUrl: string = environment.baseUrl;

  public generalStatus = GeneralStatus;

  constructor() { }

  // Obtener tareas de usuario
  getTasks(id: number): Observable<ResponseTasks>{
    const url = `${this.baseUrl}/tasks/tasks-by-user-id/${id}`;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    
    return this.http.get<ResponseTasks>(url, { headers})
      .pipe(
        map(res =>{
          return res;
        }),
          
        // Return Errors
        catchError( err =>{
          return throwError(() => err);
        })
        
      );
  }

  // Crear tarea
  createTask(student: any): Observable<any>{
    const url = `${this.baseUrl}/tasks`;

    const body = student;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    
    return this.http.post<any>(url, body, {headers})
      .pipe(
        map(res =>{
          return res;
        }),
          
        // Return Errors
        catchError( err =>{
          return throwError(() => err);
        })
        
      );
  }

  // Actualizar tarea
  updateTask(id: number, task: any): Observable<any>{
    const url = `${this.baseUrl}/tasks/${id}`;

    const body = task;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    
    return this.http.patch<any>(url, body, {headers})
      .pipe(
        map(res =>{
          return res;
        }),
          
        // Return Errors
        catchError( err =>{
          return throwError(() => err);
        })
        
      );
  }

  // Eliminar array de tareas 
  deleteTasks(tasksIds: number[]): Observable<any>{
    const url = `${this.baseUrl}/tasks`;

    const body = {
      ids: tasksIds
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    
    return this.http.delete<any>(url, {headers, body})
      .pipe(
        map(res =>{
          return res;
        }),
          
        // Return Errors
        catchError( err =>{
          return throwError(() => err);
        })
        
      );
  }
}
