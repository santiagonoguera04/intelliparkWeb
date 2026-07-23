import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { AuthService } from '../../../../core/auth/auth.service';
import { User } from '../../interfaces/users.interfaces';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-home',
  standalone: true,
  templateUrl: './users-home.component.html',
  styleUrl: './users-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersHomeComponent {

  private readonly _usersService = inject(UsersService);
  private readonly _authService = inject(AuthService);

  readonly users = signal<User[]>([]);
  readonly selectedUser = signal<User | null>(null);

  readonly isLoading = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  readonly currentUser = this._authService.getStoredUser();

  get isAdmin(): boolean {
    return this.currentUser?.user_role === 'administrador';
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.isLoading.set(true);
    this.clearMessages();

    this._usersService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible cargar los usuarios.'
        );
        this.isLoading.set(false);
      }
    });
  }

  viewUser(userId: number): void {

    this.clearMessages();
    this.isLoading.set(true);

    this._usersService.getUserById(userId).subscribe({
      next: (user) => {
        this.selectedUser.set(user);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible consultar el usuario.'
        );
        this.isLoading.set(false);
      }
    });
  }

  toggleUserStatus(user: User): void {

    this.clearMessages();

    if (!this.isAdmin) {
      this.errorMessage.set('No tienes permisos para cambiar el estado de usuarios.');
      return;
    }

    this.isLoading.set(true);

    const nextStatus = !user.user_active;

    this._usersService.updateUserStatus(user.user_id, {
      user_active: nextStatus
    }).subscribe({
      next: (response) => {
        this.successMessage.set(
          response.message ?? 'Estado del usuario actualizado correctamente.'
        );
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible actualizar el estado del usuario.'
        );
        this.isLoading.set(false);
      }
    });
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
