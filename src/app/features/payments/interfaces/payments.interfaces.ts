export interface Payment {
  payment_id: number;
  payment_parking_id: number;
  payment_method: string;
  payment_amount?: number | string;
  payment_reference?: string | null;
  payment_created_at?: string;

  vehicle_plate?: string;
  vehicle_type?: string;
  parking_entry_time?: string;
  parking_exit_time?: string;
  parking_total_minutes?: number;
}

export interface CreatePaymentRequest {
  payment_parking_id: number;
  payment_method: string;
  payment_reference?: string | null;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
