import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { QuoteDataService } from '../../../../core/services/quote-data.service';
import { QuoteCalculationService } from '../../../../core/services/quote-calculation.service';
import { Driver } from '../../../../core/models/driver.model';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { CoveragePreferences } from '../../../../core/models/coverage.model';
import { InsuranceHistory } from '../../../../core/models/insurance-history.model';
import { Quote, QuoteRequest } from '../../../../core/models/quote.model';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-summary',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './review-summary.component.html',
  styleUrl: './review-summary.component.scss',
  standalone: true
})
export class ReviewSummaryComponent implements OnInit, OnDestroy {
  @Output() editStep = new EventEmitter<number>();
  @Output() quoteGenerated = new EventEmitter<Quote>();

  driver: Partial<Driver> | null = null;
  vehicle: Partial<Vehicle> | null = null;
  coverage: Partial<CoveragePreferences> | null = null;
  history: Partial<InsuranceHistory> | null = null;

  termsAccepted = new FormControl(false, Validators.requiredTrue);
  isGeneratingQuote = false;

  private destroy$ = new Subject<void>();

  constructor(
    private quoteDataService: QuoteDataService,
    private quoteCalculationService: QuoteCalculationService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAllData(): void {
    this.quoteDataService.driver$
      .pipe(takeUntil(this.destroy$))
      .subscribe(driver => this.driver = driver);

    this.quoteDataService.vehicle$
      .pipe(takeUntil(this.destroy$))
      .subscribe(vehicle => this.vehicle = vehicle);

    this.quoteDataService.coverage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(coverage => this.coverage = coverage);

    this.quoteDataService.history$
      .pipe(takeUntil(this.destroy$))
      .subscribe((history: Partial<InsuranceHistory>) => this.history = history);
  }

  onEditStep(stepIndex: number): void {
    this.editStep.emit(stepIndex);
  }

  formatCurrency(value: number | undefined): string {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCoverageLabel(value: number | undefined): string {
    if (!value) return 'N/A';
    return this.formatCurrency(value);
  }

  getDeductibleLabel(deductible: number | undefined): string {
    if (!deductible) return 'N/A';
    return this.formatCurrency(deductible);
  }

  get canGenerateQuote(): boolean {
    return this.termsAccepted.value === true &&
           this.driver !== null &&
           this.vehicle !== null &&
           this.coverage !== null;
  }

  generateQuote(): void {
    if (!this.canGenerateQuote) return;

    this.isGeneratingQuote = true;

    const quoteRequest: QuoteRequest = {
      driver: this.driver as Driver,
      vehicle: this.vehicle as Vehicle,
      coverage: this.coverage as CoveragePreferences,
      insuranceHistory: this.history as InsuranceHistory | undefined
    };

    this.quoteCalculationService.calculateQuote(quoteRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (quote) => {
          this.isGeneratingQuote = false;
          this.quoteGenerated.emit(quote);
        },
        error: (error) => {
          this.isGeneratingQuote = false;
          console.error('Error generating quote:', error);
        }
      });
  }
}
