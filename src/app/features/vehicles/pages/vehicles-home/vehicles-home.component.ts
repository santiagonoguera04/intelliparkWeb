import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Vehicle, CreateVehicleRequest } from '../../interfaces/vehicles.interfaces';
import { VehiclesService } from '../../services/vehicles.service';

@Component({
  selector: 'app-vehicles-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vehicles-home.component.html',
  styleUrl: './vehicles-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiclesHomeComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly _vehiclesService = inject(VehiclesService);

  readonly vehicles = signal<Vehicle[]>([]);
  readonly foundVehicle = signal<Vehicle | null>(null);

  readonly isLoading = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  readonly vehicleForm = this.formBuilder.nonNullable.group({
    vehicle_plate: ['', [Validators.required, Validators.minLength(5)]],
    vehicle_type: ['carro', [Validators.required]],
    vehicle_brand: ['', [Validators.required]],
    vehicle_color: ['', [Validators.required]]
  });

  readonly searchForm = this.formBuilder.nonNullable.group({
    vehicle_plate: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {

    this.isLoading.set(true);
    this.clearMessages();

    this._vehiclesService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles.set(vehicles);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible cargar los vehículos.'
        );
        this.isLoading.set(false);
      }
    });
  }

  createVehicle(): void {

    this.clearMessages();

    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.vehicleForm.getRawValue();

    const payload : CreateVehicleRequest = {
      vehicle_plate: this.normalizePlate(formValue.vehicle_plate),
      vehicle_type: formValue.vehicle_type,
      vehicle_brand: formValue.vehicle_brand.trim(),
      vehicle_color: formValue.vehicle_color.trim()
    };

    this._vehiclesService.createVehicle(payload).subscribe({
      next: (response) => {

        this.successMessage.set(response.message ?? 'Vehículo registrado correctamente.');

        this.vehicleForm.reset({
          vehicle_plate: '',
          vehicle_type: 'carro',
          vehicle_brand: '',
          vehicle_color: ''
        });

        this.loadVehicles();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No fue posible registrar el vehículo.'
        );
        this.isLoading.set(false);
      }
    });
  }

  searchByPlate(): void {

    this.clearMessages();
    this.foundVehicle.set(null);

    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const plate = this.normalizePlate(this.searchForm.controls.vehicle_plate.value);

    this._vehiclesService.getVehicleByPlate(plate).subscribe({
      next: (vehicle) => {
        this.foundVehicle.set(vehicle);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'No se encontró un vehículo con esa placa.'
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
