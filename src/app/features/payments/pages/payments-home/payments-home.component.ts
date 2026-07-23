import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Payment, CreatePaymentRequest } from '../../interfaces/payments.interfaces';
import { PaymentsService } from '../../services/payments.service';

@Component({
  selector: 'app-payments-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './payments-home.component.html',
  styleUrl: './payments-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsHomeComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly _paymentsService = inject(PaymentsService);

  readonly payments = signal<Payment[]>([]);
  readonly foundPayment = signal<Payment | null>(null);

  readonly isLoading = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  readonly paymentForm = this.formBuilder.nonNullable.group({
    payment_parking_id: [0, [Validators.required, Validators.min(1)]],
    payment_method: ['efectivo', [Validators.required]],
    payment_reference: ['']
  });

  readonly searchForm = this.formBuilder.nonNullable.group({
    parking_id: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {

    this.isLoading.set(true);
    this.clearMessages();

    this._paymentsService.getPayments().subscribe({
      next: (payments) => {
        this.payments.set(payments);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible cargar los pagos.'
        );
        this.isLoading.set(false);
      }
    });
  }

  createPayment(): void {

    this.clearMessages();

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.paymentForm.getRawValue();

    const payload: CreatePaymentRequest = {
      payment_parking_id: Number(formValue.payment_parking_id),
      payment_method: formValue.payment_method,
      payment_reference: formValue.payment_reference.trim() || null
    };

    this._paymentsService.createPayment(payload).subscribe({
      next: (response) => {
        this.successMessage.set(response.message ?? 'Pago registrado correctamente.');

        this.paymentForm.reset({
          payment_parking_id: 0,
          payment_method: 'efectivo',
          payment_reference: ''
        });

        this.loadPayments();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible registrar el pago.'
        );
        this.isLoading.set(false);
      }
    });
  }

  searchPaymentByParkingId(): void {

    this.clearMessages();
    this.foundPayment.set(null);

    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const parkingId = Number(this.searchForm.controls.parking_id.value);

    this._paymentsService.getPaymentByParkingId(parkingId).subscribe({
      next: (payment) => {
        this.foundPayment.set(payment);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No se encontró pago para ese parqueo.'
        );
        this.isLoading.set(false);
      }
    });
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
