import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { AuthUser, LoginRequest, LoginResponse, UserMeResponse } from './auth.interface';
/*
  •	@Injectable({ providedIn: 'root' }) → Patrón Singleton: un solo objeto compartido por toda la app
  •	signal() → Nueva forma reactiva de Angular. Reemplaza a las variables normales cuando necesitas que la UI reaccione a cambios
  •	localStorage → Almacenamiento del navegador que persiste aunque recargues la página
*/

/**
 * Este servicio es para realizar la autenticación del usuario en nuestro sistema
 */
@Injectable({
  providedIn: 'root' // Este servicio existe UNA sola vez en toda la app (Singleton)
})
export class AuthService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  // Clave para guardar en localStorage del navegador
  private readonly tokenKey = 'intellipark_token';
  private readonly userKey = 'intellipark_user';

  // signal() = variable reactiva. Cuando cambia, Angular actualiza la UI automáticamente
  // Se inicializa leyendo si hay sesión guardada en localStorage
  readonly isLoggedIn = signal(this.hasStoredSession());

  // Método que intenta hacer login
  login(user_email: string, user_password: string, remember?: boolean): Observable<LoginResponse> {

    const payload: LoginRequest = {
      user_email: user_email,
      user_password: user_password
    };

    return this.httpClient.post<LoginResponse>(`${this.apiBaseUrl}/auth/user-login`, payload)
               .pipe(
                tap((response: LoginResponse) => {

                  const token = this.extractToken(response);
                  const user = this.extractUser(response);

                  if(token){
                    localStorage.setItem(this.tokenKey, token);
                    this.isLoggedIn.set(true);
                  }

                  if(user){
                    localStorage.setItem(this.userKey, JSON.stringify(user));
                  }
                })
               )

  }

  getCurrentUser(): Observable<AuthUser | null> {

    return this.httpClient.get<UserMeResponse>(`${this.apiBaseUrl}/auth/user-me`)
               .pipe(
                  map((response) => response.data ?? null),
                  tap((userMe) => {
                    if (userMe) {
                      localStorage.setItem(this.userKey, JSON.stringify(userMe));
                    }
                  })
                );
  }

  logout(): void {
    // Borra la sesión del navegador
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedIn.set(false); // Actualiza el signal a "no logueado"
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getStoredUser(): AuthUser | null {
    const storedUser = localStorage.getItem(this.userKey);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as AuthUser;
  }

  // Método privado: verifica si existe sesión guardada
  private hasStoredSession(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private extractToken(response: LoginResponse): string | null {
    return response.token ?? response.data?.token ?? null;
  }

  private extractUser(response: LoginResponse): AuthUser | null {
    return response.user ?? response.data?.user ?? null;
  }
}
