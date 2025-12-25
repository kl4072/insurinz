import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { QuoteDataService } from '../../../../core/services/quote-data.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Subject, takeUntil } from 'rxjs';
import { FormFieldErrorComponent } from '../../../../shared/components/form-field-error/form-field-error.component';

@Component({
  selector: 'app-driver-info-step',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './driver-info-step.component.html',
  styleUrl: './driver-info-step.component.scss',
  standalone: true
})
export class DriverInfoStepComponent implements OnInit, OnDestroy {
  driverForm!: FormGroup;
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
    this.driverForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', [Validators.required, CustomValidators.minimumAge(16)]],
      age: [0],
      licenseNumber: ['', Validators.required],
      licenseState: ['', Validators.required],
      licenseIssueDate: ['', [Validators.required, CustomValidators.pastDate()]],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      drivingHistory: this.fb.group({
        yearsLicensed: [0],
        accidents: [[]],
        violations: [[]],
        dui: [false]
      })
    });

    this.driverForm.get('dateOfBirth')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(dob => {
      if (dob) {
        const age = this.calculateAge(new Date(dob));
        this.driverForm.get('age')?.setValue(age, { emitEvent: false });
      }
    });

    this.driverForm.get('licenseIssueDate')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(date => {
      if (date) {
        const years = new Date().getFullYear() - new Date(date).getFullYear();
        this.driverForm.get('drivingHistory.yearsLicensed')?.setValue(years, { emitEvent: false });
      }
    });
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private setupAutoSave(): void {
    this.driverForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (this.driverForm.valid) {
        this.quoteDataService.updateDriver(value);
      }
    });
  }
}
