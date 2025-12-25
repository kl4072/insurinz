import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { MaterialModule } from '../../../../shared/material.module';
import { DriverInfoStepComponent } from '../driver-info-step/driver-info-step.component';
import { VehicleDetailsStepComponent } from '../vehicle-details-step/vehicle-details-step.component';
import { CoveragePreferencesStepComponent } from '../coverage-preferences-step/coverage-preferences-step.component';
import { InsuranceHistoryStepComponent } from '../insurance-history-step/insurance-history-step.component';
import { ReviewSummaryComponent } from '../review-summary/review-summary.component';
import { QuoteResultComponent } from '../quote-result/quote-result.component';
import { QuoteDataService } from '../../../../core/services/quote-data.service';
import { Quote } from '../../../../core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wizard-container',
  imports: [
    CommonModule,
    MaterialModule,
    DriverInfoStepComponent,
    VehicleDetailsStepComponent,
    CoveragePreferencesStepComponent,
    InsuranceHistoryStepComponent,
    ReviewSummaryComponent,
    QuoteResultComponent
  ],
  templateUrl: './wizard-container.component.html',
  styleUrl: './wizard-container.component.scss',
  standalone: true
})
export class WizardContainerComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  quote: Quote | null = null;
  showQuoteResult = false;

  constructor(
    public quoteDataService: QuoteDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  onQuoteGenerated(quote: Quote): void {
    this.quote = quote;
    this.showQuoteResult = true;
  }

  onEditStep(stepIndex: number): void {
    if (this.stepper) {
      this.stepper.selectedIndex = stepIndex;
    }
  }

  onNewQuote(): void {
    this.quoteDataService.clearQuoteData();
    this.showQuoteResult = false;
    this.stepper.reset();
  }
}
