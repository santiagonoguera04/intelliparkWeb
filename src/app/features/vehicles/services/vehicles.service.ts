import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../enviroments/environment';
import {
  ApiResponse,
  CreateVehicleRequest,
  Vehicle
} from '../interfaces/vehicles.interfaces';

type VehicleListResponse = ApiResponse<Vehicle[]> | Vehicle[];
type VehicleResponse = ApiResponse<Vehicle> | Vehicle;

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getVehicles(): Observable<Vehicle[]> {

    return this.httpClient
      .get<VehicleListResponse>(`${this.apiBaseUrl}/vehicles`)
      .pipe(
        map((response) => {

          if (Array.isArray(response)) {
            return response;
          }

          return response.data ?? [];
        })
      );
  }

  createVehicle(payload: CreateVehicleRequest): Observable<ApiResponse<Vehicle>> {

    return this.httpClient.post<ApiResponse<Vehicle>>(
      `${this.apiBaseUrl}/vehicles`,
      payload
    );

  }

  getVehicleByPlate(plate: string): Observable<Vehicle | null> {
    return this.httpClient
      .get<VehicleResponse>(`${this.apiBaseUrl}/vehicles/plate/${plate}`)
      .pipe(
        map((response) => {
          if ('data' in response) {
            return response.data;
          }

          return response;
        })
      );
  }
}
