import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { QuoteDataService } from '../../../../core/services/quote-data.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Subject, takeUntil } from 'rxjs';
import { FormFieldErrorComponent } from '../../../../shared/components/form-field-error/form-field-error.component';

@Component({
  selector: 'app-insurance-history-step',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './insurance-history-step.component.html',
  styleUrl: './insurance-history-step.component.scss',
  standalone: true
})
export class InsuranceHistoryStepComponent implements OnInit, OnDestroy {
  historyForm!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private quoteDataService: QuoteDataService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupAutoSave();
    this.setupConditionalValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.historyForm = this.fb.group({
      currentlyInsured: [true, Validators.required],
      currentInsurer: [''],
      policyExpirationDate: [''],
      continuousCoverage: [true],
      yearsWithCurrentInsurer: [0],
      lapseInCoverage: [false],
      lapseReason: [''],
      claims: this.fb.array([])
    });
  }

  private setupConditionalValidation(): void {
    this.historyForm.get('currentlyInsured')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value) {
          this.historyForm.get('currentInsurer')?.setValidators(Validators.required);
          this.historyForm.get('policyExpirationDate')?.setValidators([Validators.required, CustomValidators.futureDate()]);
        } else {
          this.historyForm.get('currentInsurer')?.clearValidators();
          this.historyForm.get('policyExpirationDate')?.clearValidators();
        }
        this.historyForm.get('currentInsurer')?.updateValueAndValidity();
        this.historyForm.get('policyExpirationDate')?.updateValueAndValidity();
      });

    this.historyForm.get('lapseInCoverage')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value) {
          this.historyForm.get('lapseReason')?.setValidators(Validators.required);
        } else {
          this.historyForm.get('lapseReason')?.clearValidators();
        }
        this.historyForm.get('lapseReason')?.updateValueAndValidity();
      });
  }

  get claims(): FormArray {
    return this.historyForm.get('claims') as FormArray;
  }

  addClaim(): void {
    const claimGroup = this.fb.group({
      date: ['', [Validators.required, CustomValidators.pastDate()]],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      amountPaid: [0, [Validators.required, Validators.min(0)]],
      atFault: [false]
    });
    this.claims.push(claimGroup);
  }

  removeClaim(index: number): void {
    this.claims.removeAt(index);
  }

  private setupAutoSave(): void {
    this.historyForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (this.historyForm.valid) {
          this.quoteDataService.updateInsuranceHistory(value);
        }
      });
  }
}
