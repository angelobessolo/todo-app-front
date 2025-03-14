import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';

// Validar bien las rutas hijas ya que acadeberia redirigir a otras routas hijas para usuarios, asesores, etc 
export const DashboardRoutes: Routes = [
    {
        path: '',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () => import('./pages/dashboard-layout/dashboard-layout.component').then( c => c.DashboardLayoutComponent ),
        children: [
            {
                path: 'todo-list',
                canActivate: [isAuthenticatedGuard],
                loadComponent: () => import('./components/todo-list/todo-list.component').then( c => c.TodoListComponent )
            },
            {
                path: '',
                redirectTo: '/dashboard/todo-list',
                pathMatch: 'full',
            },
        ]
    },
];
