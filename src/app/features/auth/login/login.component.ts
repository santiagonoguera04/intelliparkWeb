import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Directivas básicas como *ngIf // Habilita formularios reactivos
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Optimización: solo re-renderiza si algo cambia
})
export class LoginComponent {
  // inject() = nueva forma de inyección de dependencias (sin constructor)

  private readonly formBuilder = inject(FormBuilder); // Constructor de formularios
  private readonly router = inject(Router); // Para navegar entre rutas
  private readonly _authService = inject(AuthService); // Servicio de autenticación

  // Signals: variables reactivas
  readonly hidePassword = signal(true); // Controla si la contraseña está oculta
  readonly loginError = signal(''); // Mensaje de error del login

  // Definición del formulario reactivo con validaciones
  readonly loginForm = this.formBuilder.nonNullable.group({
    user_email: ['', [Validators.required, Validators.email]], // Campo obligatorio
    user_password: ['', [Validators.required, Validators.minLength(6)]], // Campo obligatorio // Mínimo 6 caracteres
    remember: [false] // Checkbox "recuérdame" (por defecto desmarcado)
  });

  // computed() = valor calculado basado en otro signal/expresión
  readonly emailControl = computed(() => this.loginForm.controls.user_email);
  readonly passwordControl = computed(() => this.loginForm.controls.user_password);

  // Alterna visibilidad de contraseña
  togglePasswordVisibility(): void {
    this.hidePassword.update((value) => !value);
  }

  // Se ejecuta al hacer clic en "Ingresar"
  login(): void {
    this.loginError.set(''); // Limpia errores anteriores

    if (this.loginForm.invalid) {  // ¿El formulario tiene errores?
      this.loginForm.markAllAsTouched(); // Marca todos los campos como "tocados" para mostrar errores
      return; // Detiene la ejecución
    }

    const { user_email, user_password } = this.loginForm.getRawValue(); // Extrae valores del formulario

    this._authService.login(user_email, user_password).subscribe({
      next: () => {
        // Login exitoso → navega al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // Muestra error
        const message = error.error?.message ?? 'No fue posible iniciar sesión. Verifica tus credenciales.';
        this.loginError.set(message);
      }
    });
  }

  recovery(){
    this.router.navigate(['/recovery']);
  }
}
