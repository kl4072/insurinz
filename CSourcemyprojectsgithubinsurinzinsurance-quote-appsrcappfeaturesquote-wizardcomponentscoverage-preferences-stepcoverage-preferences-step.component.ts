import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { QuoteDataService } from '../../../../core/services/quote-data.service';
import { Subject, takeUntil } from 'rxjs';
import { FormFieldErrorComponent } from '../../../../shared/components/form-field-error/form-field-error.component';

@Component({
  selector: 'app-coverage-preferences-step',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './coverage-preferences-step.component.html',
  styleUrl: './coverage-preferences-step.component.scss',
  standalone: true
})
export class CoveragePreferencesStepComponent implements OnInit, OnDestroy {
  coverageForm!: FormGroup;
  private destroy$ = new Subject<void>();

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
    this.coverageForm = this.fb.group({
      liability: this.fb.group({
        bodilyInjuryPerPerson: [100000, Validators.required],
        bodilyInjuryPerAccident: [300000, Validators.required],
        propertyDamage: [100000, Validators.required]
      }),
      collision: this.fb.group({
        enabled: [true],
        deductible: [1000]
      }),
      comprehensive: this.fb.group({
        enabled: [true],
        deductible: [1000]
      }),
      personalInjuryProtection: [false],
      uninsuredMotoristCoverage: [true],
      medicalPayments: this.fb.group({
        enabled: [false],
        limit: [5000]
      }),
      rentalReimbursement: [false],
      roadsideAssistance: [true]
    });
  }

  private setupAutoSave(): void {
    this.coverageForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (this.coverageForm.valid) {
        this.quoteDataService.updateCoverage(value);
      }
    });
  }
}
