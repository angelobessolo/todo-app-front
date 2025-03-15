import { Routes } from '@angular/router';
import { isNotAuthenticatedGuard } from './guards/is-not-authenticated.guard';

export const AuthRoutes: Routes = [
    {
        // No se necesita estar logueado para llegar a ella 
        path: '',
        canActivate: [isNotAuthenticatedGuard],
        loadComponent: () => import('./pages/sign-in/sign-in.component').then( c => c.SignInComponent )
    },
    {
        // No se necesita estar logueado para llegar a ella 
        path: 'sign-in',
        canActivate: [isNotAuthenticatedGuard],
        loadComponent: () => import('./pages/sign-in/sign-in.component').then( c => c.SignInComponent )
    },
    {
        // Redirige a login
        path: '',
        redirectTo: '/sign-in',
        pathMatch: 'full',
    },
    {   
        // Pagina para rutas inexistentes
        path: '**', 
        loadComponent: () => import('./pages/none-page/none-page.component').then(c => c.NonePageComponent )  
    },
];
