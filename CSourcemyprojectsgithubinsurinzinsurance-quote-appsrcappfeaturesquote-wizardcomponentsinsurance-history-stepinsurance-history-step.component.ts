import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { QuoteDataService } from '../../../../core/services/quote-data.service';
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
      claims: [[]]
    });

    this.historyForm.get('currentlyInsured')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value) {
        this.historyForm.get('currentInsurer')?.setValidators(Validators.required);
      } else {
        this.historyForm.get('currentInsurer')?.clearValidators();
      }
      this.historyForm.get('currentInsurer')?.updateValueAndValidity();
    });
  }

  private setupAutoSave(): void {
    this.historyForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (this.historyForm.valid) {
        this.quoteDataService.updateInsuranceHistory(value);
      }
    });
  }
}
