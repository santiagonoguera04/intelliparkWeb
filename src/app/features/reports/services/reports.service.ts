import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../enviroments/environment';

import { ApiResponse, IncomeReport } from '../interfaces/reports.interfaces';

type IncomeReportResponse = ApiResponse<IncomeReport> | IncomeReport;

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getIncomeReport(from: string, to: string): Observable<IncomeReport> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.httpClient
      .get<IncomeReportResponse>(`${this.apiBaseUrl}/reports/income`, { params })
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
