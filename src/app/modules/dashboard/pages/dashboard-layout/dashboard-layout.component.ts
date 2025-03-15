import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Event, Router, RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrAlertService } from '../../../shared/services/toastr-alert/toastr-alert.service';
import { GeneralStatus } from '../../../shared/enums/general-status.enum';

@Component({
  selector: 'app-dashboard-layout',
  imports: [  
    CommonModule, 
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
  ],
  standalone: true,
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit{
  public authService = inject(AuthService);
  private spinner = inject(NgxSpinnerService);
  private toastr  = inject(ToastrAlertService);
  public router = inject(Router);
  public todoListPath: string = '/dashboard/todo-list';
  
  public isSidebarToggled = false;
  public userParams: any;
  public generalStatus = GeneralStatus;

  constructor() {}
  
  ngOnInit(): void {
    this.userParams = localStorage.getItem('userParams');
    if (this.userParams) {
      const decodedString = atob(this.userParams);
      this.userParams = JSON.parse(decodedString);
    }
  }

  // Cerrar sesión
  public logout(){
    this.spinner.show();
    setTimeout(() => { 
      this.authService.logout().subscribe({
        next: (response) => {
          this.spinner.hide();
          // Levanta alerta al usuario
          this.toastr.showSucces('Finalizar Sesión', 'Sesión Finalizada Exitosamente');
          this.router.navigateByUrl('/auth');
        },
        error: (response) => {
          this.spinner.hide();
        } 
      })
    }, 500); 
  }
}
