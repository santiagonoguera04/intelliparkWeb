export interface User {
  user_id: number;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_role: 'administrador' | 'operador';
  user_active: boolean;
  user_created_at?: string;
}

export interface UpdateUserStatusRequest {
  user_active: boolean;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
