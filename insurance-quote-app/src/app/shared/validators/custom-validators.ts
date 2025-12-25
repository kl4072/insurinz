import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static vin(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
      return vinPattern.test(control.value) ? null : { invalidVin: true };
    };
  }

  static minimumAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const birthDate = new Date(control.value);
      const age = this.calculateAge(birthDate);
      return age >= minAge ? null : { minimumAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const date = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today ? null : { notFutureDate: true };
    };
  }

  static pastDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const date = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today ? null : { notPastDate: true };
    };
  }

  static zipCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const zipPattern = /^\d{5}(-\d{4})?$/;
      return zipPattern.test(control.value) ? null : { invalidZipCode: true };
    };
  }

  static dateRange(minDate: Date, maxDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const date = new Date(control.value);
      if (date < minDate || date > maxDate) {
        return { dateOutOfRange: { min: minDate, max: maxDate, actual: date } };
      }
      return null;
    };
  }

  private static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
