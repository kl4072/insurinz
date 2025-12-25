import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field-error',
  imports: [CommonModule],
  templateUrl: './form-field-error.component.html',
  styleUrl: './form-field-error.component.scss',
  standalone: true
})
export class FormFieldErrorComponent {
  @Input() control!: AbstractControl | null;
  @Input() fieldName: string = 'Field';

  getErrorMessage(): string {
    if (!this.control || !this.control.errors) {
      return '';
    }

    const errors = this.control.errors;

    if (errors['required']) {
      return `${this.fieldName} is required`;
    }

    if (errors['minlength']) {
      return `${this.fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
    }

    if (errors['maxlength']) {
      return `${this.fieldName} must be no more than ${errors['maxlength'].requiredLength} characters`;
    }

    if (errors['min']) {
      return `${this.fieldName} must be at least ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `${this.fieldName} must be no more than ${errors['max'].max}`;
    }

    if (errors['email']) {
      return 'Please enter a valid email address';
    }

    if (errors['pattern']) {
      return `${this.fieldName} format is invalid`;
    }

    if (errors['invalidVin']) {
      return 'VIN must be 17 characters (excluding I, O, Q)';
    }

    if (errors['minimumAge']) {
      return `Minimum age requirement is ${errors['minimumAge'].requiredAge} years`;
    }

    if (errors['notFutureDate']) {
      return 'Date must be in the future';
    }

    if (errors['notPastDate']) {
      return 'Date must be in the past';
    }

    if (errors['invalidZipCode']) {
      return 'Please enter a valid ZIP code (12345 or 12345-6789)';
    }

    if (errors['dateOutOfRange']) {
      return 'Date is out of valid range';
    }

    return 'Invalid value';
  }

  shouldShowError(): boolean {
    return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
  }
}
