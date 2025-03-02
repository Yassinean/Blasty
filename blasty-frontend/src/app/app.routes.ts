import { Routes } from '@angular/router';
import { AuthGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Accueil',
    children:[
      {
        path:'',
        loadComponent:()=> import('./features/home/hero/hero.component').then(m=>m.HeroComponent)
      },
      {
        path:'features',
        loadComponent:()=> import('./features/home/features-app/features-app.component').then(m=>m.FeaturesAppComponent)
      },
      {
        path:'how-it-works',
        loadComponent:()=> import('./features/home/how-it-works/how-it-works.component').then(m=>m.HowItWorksComponent)
      },
      {
        path:'pricing',
        loadComponent:()=> import('./features/home/pricing/pricing.component').then(m=>m.PricingComponent)
      },
    ]
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/auth/auth-selection/auth-selection.component').then(m => m.AuthSelectionComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'login/:role',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'admin/dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'client/dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' }
];
