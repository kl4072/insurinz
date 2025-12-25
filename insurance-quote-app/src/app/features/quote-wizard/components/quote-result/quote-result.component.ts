import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { Quote } from '../../../../core/models';

@Component({
  selector: 'app-quote-result',
  imports: [CommonModule, MaterialModule],
  templateUrl: './quote-result.component.html',
  styleUrl: './quote-result.component.scss',
  standalone: true
})
export class QuoteResultComponent {
  @Input() quote!: Quote;
  @Output() newQuote = new EventEmitter<void>();

  startNewQuote(): void {
    this.newQuote.emit();
  }
}
