import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import { ParkingRecord } from '../../interfaces/parking.interfaces';
import { ParkingService } from '../../services/parking.service';


@Component({
  selector: 'app-parking-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './parking-home.component.html',
  styleUrl: './parking-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParkingHomeComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly _parkingService = inject(ParkingService);

  readonly activeRecords = signal<ParkingRecord[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly successMessage = signal<string>('');
  readonly errorMessage = signal<string>('');

  readonly checkInForm = this.formBuilder.nonNullable.group({
    vehicle_plate: ['', [Validators.required, Validators.minLength(5)]],
    vehicle_type: ['carro', [Validators.required]]
  });

  readonly checkOutForm = this.formBuilder.nonNullable.group({
    vehicle_plate: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit(): void {
    this.loadActiveRecords();
  }

  loadActiveRecords(): void {

    this.isLoading.set(true);
    this.clearMessages();

    this._parkingService.getActiveParkingRecords().subscribe({
      next: (recordsResponse) => {
        this.activeRecords.set(recordsResponse);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible cargar los vehículos activos.'
        );
        this.isLoading.set(false);
      }
    });
  }

  registerCheckIn(): void {
    this.clearMessages();

    if (this.checkInForm.invalid) {
      this.checkInForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const payload = {
      vehicle_plate: this.normalizePlate(this.checkInForm.controls.vehicle_plate.value),
      vehicle_type: this.checkInForm.controls.vehicle_type.value
    };

    this._parkingService.checkIn(payload).subscribe({
      next: (response) => {
        this.successMessage.set(response.message ?? 'Ingreso registrado correctamente.');
        this.checkInForm.reset({
          vehicle_plate: '',
          vehicle_type: 'carro'
        });
        this.loadActiveRecords();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible registrar el ingreso.'
        );
        this.isLoading.set(false);
      }
    });
  }

  registerCheckOut(): void {

    this.clearMessages();

    if (this.checkOutForm.invalid) {
      this.checkOutForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const payload = {
      vehicle_plate: this.normalizePlate(this.checkOutForm.controls.vehicle_plate.value)
    };

    this._parkingService.checkOut(payload).subscribe({
      next: (response) => {
        this.successMessage.set(response.message ?? 'Salida registrada correctamente.');
        this.checkOutForm.reset({
          vehicle_plate: ''
        });
        this.loadActiveRecords();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible registrar la salida.'
        );
        this.isLoading.set(false);
      }
    });
  }

  private normalizePlate(plate: string): string {
    return plate.trim().toUpperCase();
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
