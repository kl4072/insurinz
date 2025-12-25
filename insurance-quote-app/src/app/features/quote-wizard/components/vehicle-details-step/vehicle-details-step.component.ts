import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { QuoteDataService } from '../../../../core/services/quote-data.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Subject, takeUntil } from 'rxjs';
import { FormFieldErrorComponent } from '../../../../shared/components/form-field-error/form-field-error.component';

@Component({
  selector: 'app-vehicle-details-step',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './vehicle-details-step.component.html',
  styleUrl: './vehicle-details-step.component.scss',
  standalone: true
})
export class VehicleDetailsStepComponent implements OnInit, OnDestroy {
  vehicleForm!: FormGroup;
  private destroy$ = new Subject<void>();

  states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  constructor(
    private fb: FormBuilder,
    private quoteDataService: QuoteDataService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupAutoSave();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.vehicleForm = this.fb.group({
      vin: ['', [Validators.required, CustomValidators.vin()]],
      year: ['', [Validators.required, Validators.min(1985), Validators.max(2026)]],
      make: ['', Validators.required],
      model: ['', Validators.required],
      bodyType: ['', Validators.required],
      primaryUse: ['', Validators.required],
      annualMileage: ['', [Validators.required, Validators.min(1), Validators.max(100000)]],
      ownership: ['', Validators.required],
      antiTheftDevices: [false],
      safetyFeatures: [[]],
      garagingAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, CustomValidators.zipCode()]]
      })
    });
  }

  private setupAutoSave(): void {
    this.vehicleForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (this.vehicleForm.valid) {
        this.quoteDataService.updateVehicle(value);
      }
    });
  }
}
