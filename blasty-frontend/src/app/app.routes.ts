import { Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { ClientGuard } from './core/guards/client.guard';
import { NonAuthGuard } from './core/guards/non-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Accueil',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/hero/hero.component').then(
            (m) => m.HeroComponent
          ),
      },
      {
        path: 'features',
        loadComponent: () =>
          import('./features/home/features-app/features-app.component').then(
            (m) => m.FeaturesAppComponent
          ),
      },
      {
        path: 'how-it-works',
        loadComponent: () =>
          import('./features/home/how-it-works/how-it-works.component').then(
            (m) => m.HowItWorksComponent
          ),
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./features/home/pricing/pricing.component').then(
            (m) => m.PricingComponent
          ),
      },
    ],
  },
  {
    path: 'auth',
    canActivate: [NonAuthGuard], // Un-commented this line
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/auth/auth-selection/auth-selection.component'
          ).then((m) => m.AuthSelectionComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: 'login/:role',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
    ],
  },
  {
    path: 'admin/dashboard',
    canActivate: [AdminGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'statistics', // Ensure there's a valid default child
        pathMatch: 'full',
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import(
            './features/admin/dashboard/statistics/statistics.component'
          ).then((m) => m.StatisticsComponent),
      },
      {
        path: 'parking-management',
        loadComponent: () =>
          import(
            './features/admin/dashboard/parking-management/parking-management.component'
          ).then((m) => m.ParkingManagementComponent),
      },
      {
        path: 'place-management',
        loadComponent: () =>
          import(
            './features/admin/dashboard/place-management/place-management.component'
          ).then((m) => m.PlaceManagementComponent),
      },
    ],
  },
  {
    path: 'client/dashboard',
    canActivate: [ClientGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  { path: '**', loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
