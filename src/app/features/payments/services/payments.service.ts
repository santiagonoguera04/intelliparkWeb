import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../enviroments/environment';
import {
  ApiResponse,
  CreatePaymentRequest,
  Payment
} from '../interfaces/payments.interfaces';

type PaymentListResponse = ApiResponse<Payment[]> | Payment[];
type PaymentResponse = ApiResponse<Payment> | Payment;

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getPayments(): Observable<Payment[]> {

    return this.httpClient
      .get<PaymentListResponse>(`${this.apiBaseUrl}/payments`)
      .pipe(
        map((response) => {

          if (Array.isArray(response)) {
            return response;
          }

          return response.data ?? [];
        })
      );
  }

  createPayment(payload: CreatePaymentRequest): Observable<ApiResponse<Payment>> {

    return this.httpClient.post<ApiResponse<Payment>>(
      `${this.apiBaseUrl}/payments`,
      payload
    );

  }

  getPaymentById(paymentId: number): Observable<Payment> {

    return this.httpClient
      .get<PaymentResponse>(`${this.apiBaseUrl}/payments/${paymentId}`)
      .pipe(
        map((response) => {

          if ('data' in response) {
            return response.data;
          }

          return response;
        })
      );
  }

  getPaymentByParkingId(parkingId: number): Observable<Payment> {

    return this.httpClient
      .get<PaymentResponse>(`${this.apiBaseUrl}/payments/parking/${parkingId}`)
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
