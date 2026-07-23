import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../enviroments/environment';
import {
  ApiResponse,
  CheckInRequest,
  CheckOutRequest,
  ParkingRecord
} from '../interfaces/parking.interfaces';

type ParkingListResponse = ApiResponse<ParkingRecord[]> | ParkingRecord[];

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  checkIn(payload: CheckInRequest): Observable<ApiResponse<ParkingRecord>> {
    return this.httpClient.post<ApiResponse<ParkingRecord>>(
      `${this.apiBaseUrl}/parking/check-in`,
      payload
    );
  }

  checkOut(payload: CheckOutRequest): Observable<ApiResponse<ParkingRecord>> {
    return this.httpClient.post<ApiResponse<ParkingRecord>>(
      `${this.apiBaseUrl}/parking/check-out`,
      payload
    );
  }

  getActiveParkingRecords(): Observable<ParkingRecord[]> {
    return this.httpClient
      .get<ParkingListResponse>(`${this.apiBaseUrl}/parking/active`)
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            return response;
          }

          return response.data ?? [];
        })
      );
  }
}
