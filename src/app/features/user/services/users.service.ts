import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../enviroments/environment';
import {
  ApiResponse,
  UpdateUserStatusRequest,
  User
} from '../interfaces/users.interfaces';

type UserListResponse = ApiResponse<User[]> | User[];
type UserResponse = ApiResponse<User> | User;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<UserListResponse>(`${this.apiBaseUrl}/users`)
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            return response;
          }

          return response.data ?? [];
        })
      );
  }

  getUserById(userId: number): Observable<User> {
    return this.httpClient
      .get<UserResponse>(`${this.apiBaseUrl}/users/${userId}`)
      .pipe(
        map((response) => {
          if ('data' in response) {
            return response.data;
          }

          return response;
        })
      );
  }

  updateUserStatus(
    userId: number,
    payload: UpdateUserStatusRequest
  ): Observable<ApiResponse<User>> {
    return this.httpClient.patch<ApiResponse<User>>(
      `${this.apiBaseUrl}/users/${userId}/status`,
      payload
    );
  }
}
