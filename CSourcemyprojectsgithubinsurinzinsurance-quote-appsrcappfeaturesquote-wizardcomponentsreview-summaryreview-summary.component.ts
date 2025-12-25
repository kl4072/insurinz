import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { QuoteDataService } from '../../../../core/services/quote-data.service';
import { QuoteCalculationService } from '../../../../core/services/quote-calculation.service';
import { Quote } from '../../../../core/models';

@Component({
  selector: 'app-review-summary',
  imports: [CommonModule, MaterialModule],
  templateUrl: './review-summary.component.html',
  styleUrl: './review-summary.component.scss',
  standalone: true
})
export class ReviewSummaryComponent implements OnInit {
  @Output() quoteGenerated = new EventEmitter<Quote>();

  driver: any;
  vehicle: any;
  coverage: any;
  history: any;
  loading = false;

  constructor(
    private quoteDataService: QuoteDataService,
    private quoteCalculationService: QuoteCalculationService
  ) {}

  ngOnInit(): void {
    this.quoteDataService.driver$.subscribe(driver => this.driver = driver);
    this.quoteDataService.vehicle$.subscribe(vehicle => this.vehicle = vehicle);
    this.quoteDataService.coverage$.subscribe(coverage => this.coverage = coverage);
    this.quoteDataService.history$.subscribe(history => this.history = history);
  }

  generateQuote(): void {
    this.loading = true;
    const request = this.quoteDataService.getQuoteRequest();
    this.quoteCalculationService.calculateQuote(request).subscribe(quote => {
      this.loading = false;
      this.quoteGenerated.emit(quote);
    });
  }
}
