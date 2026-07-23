export interface Vehicle {
  vehicle_id: number;
  vehicle_plate: string;
  vehicle_type: string;
  vehicle_brand?: string | null;
  vehicle_color?: string | null;
  vehicle_created_at?: string;
}

export interface CreateVehicleRequest {
  vehicle_plate: string;
  vehicle_type: string;
  vehicle_brand: string;
  vehicle_color: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
