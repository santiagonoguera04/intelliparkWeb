export interface IncomeReportFilters {
  from: string;
  to: string;
}

export interface IncomeReportSummary {
  totalIncome: number;
  totalPayments: number;
}

export interface IncomeByPaymentMethod {
  payment_method: string;
  total_income: number | string;
  total_payments: number | string;
}

export interface IncomeByVehicleType {
  vehicle_type: string;
  total_income: number | string;
  total_payments: number | string;
}

export interface PaymentDetail {
  payment_id: number;
  payment_parking_id: number;
  payment_method: string;
  payment_amount: number | string;
  payment_reference?: string | null;
  payment_created_at?: string;
  vehicle_plate?: string;
  vehicle_type?: string;
  parking_entry_time?: string;
  parking_exit_time?: string;
  parking_total_minutes?: number;
}

export interface IncomeReport {
  filters: IncomeReportFilters;
  summary: IncomeReportSummary;
  byPaymentMethod: IncomeByPaymentMethod[];
  byVehicleType: IncomeByVehicleType[];
  paymentDetails: PaymentDetail[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
