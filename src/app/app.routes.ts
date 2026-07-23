import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
/* Autenticación  */
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { PasswordRecoveryComponent } from './features/password-recovery/password-recovery.component';
/* Dashboard  */
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './features/dashboard/pages/home/dashboard-home.component';
import { ParkingHomeComponent } from './features/parking/pages/parking-home/parking-home.component';
import { VehiclesHomeComponent } from './features/vehicles/pages/vehicles-home/vehicles-home.component';
import { PaymentsHomeComponent } from './features/payments/pages/payments-home/payments-home.component';
import { UsersHomeComponent } from './features/user/pages/users-home/users-home.component';
import { ReportsHomeComponent } from './features/reports/pages/reports-home/reports-home.component';

/**
  URL "/"          → redirige a /login
  URL "/login"     → AuthLayout > LoginComponent
  URL "/dashboard" → DashboardLayout > DashboardHome  (protegida por authGuard)
  URL "/cualquier" → redirige a /login
*/

export const routes: Routes = [
  {
    path: '', // URL: "/" -> '' URL RAÍZ
    redirectTo: 'login', // Redirige automáticamente a "/login"
    pathMatch: 'full'
  },
  {
    path: '', // URLs de autenticación
    component: AuthLayoutComponent, // Usa el layout de auth como contenedor
    children: [
      {
        path: 'login', // URL: "/login"
        component: LoginComponent // Muestra el formulario de login
      },
      {
        path: 'recovery', // URL: "/login"
        component: PasswordRecoveryComponent // Muestra el formulario de login
      }
    ]
  },
  {
    path: '', // URLs del panel admin
    component: DashboardLayoutComponent, // Usa el layout de dashboard
    canActivate: [authGuard], // Solo accesible si el usuario está logueado
    children: [
      {
        path: 'dashboard', // URL: "/dashboard"
        component: DashboardHomeComponent // Muestra el dashboard
      },
      {
        path: 'parking',
        component: ParkingHomeComponent
      },
      {
        path: 'vehicles',
        component: VehiclesHomeComponent
      },
      {
        path: 'payments',
        component: PaymentsHomeComponent
      },
      {
        path: 'users',
        component: UsersHomeComponent
      },
      {
        path: 'reports',
        component: ReportsHomeComponent
      },
    ]
  },
  {
    path: '**', // Cualquier URL que no exista
    redirectTo: 'login' // Redirige a login (página 404 implícita)
  }
];

