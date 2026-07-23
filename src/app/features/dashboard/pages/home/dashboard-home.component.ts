import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { AuthUser } from '../../../../core/auth/auth.interface';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardHomeComponent {

  private readonly router = inject(Router);
  private readonly _authService = inject(AuthService);

  readonly currentUser = signal<AuthUser | null>(this._authService.getStoredUser());

  ngOnInit(): void {

    this._authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser.set(user);
      },
      error: () => {
        this._authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this._authService.logout();
    this.router.navigate(['/login']);
  }

  summaryCards = [
    {
      title: 'Vehículos activos',
      value: '0',
      helper: 'Pendiente conectar con /api/parking/active'
    },
    {
      title: 'Pagos del día',
      value: '0',
      helper: 'Pendiente conectar con /api/payments'
    },
    {
      title: 'Usuarios registrados',
      value: '0',
      helper: 'Pendiente conectar con /api/users'
    }
  ];

  quickItems = [
    'Registrar ingreso de vehículo',
    'Registrar salida de vehículo',
    'Consultar vehículos activos',
    'Registrar pago',
    'Ver reportes'
  ];
}
