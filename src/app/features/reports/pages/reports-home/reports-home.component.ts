import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IncomeReport } from '../../interfaces/reports.interfaces';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-reports-home',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './reports-home.component.html',
  styleUrl: './reports-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsHomeComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly _reportsService = inject(ReportsService);

  readonly report = signal<IncomeReport | null>(null);
  readonly isLoading = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  readonly reportForm = this.formBuilder.nonNullable.group({
    from: [this.getTodayDate(), [Validators.required]],
    to: [this.getTodayDate(), [Validators.required]]
  });

  ngOnInit(): void {
    this.loadIncomeReport();
  }

  loadIncomeReport(): void {
    this.clearMessages();

    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const { from, to } = this.reportForm.getRawValue();

    if (from > to) {
      this.errorMessage.set('La fecha inicial no puede ser mayor que la fecha final.');
      return;
    }

    this.isLoading.set(true);

    this._reportsService.getIncomeReport(from, to).subscribe({
      next: (report) => {
        this.report.set(report);
        this.successMessage.set('Reporte generado correctamente.');
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible generar el reporte.'
        );
        this.isLoading.set(false);
      }
    });
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
