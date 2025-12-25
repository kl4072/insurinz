import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuoteRequest, Driver, Vehicle, CoveragePreferences, InsuranceHistory } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuoteDataService {
  private readonly STORAGE_KEY = 'insurance-quote-draft';

  private driverSubject = new BehaviorSubject<Partial<Driver>>({});
  private vehicleSubject = new BehaviorSubject<Partial<Vehicle>>({});
  private coverageSubject = new BehaviorSubject<Partial<CoveragePreferences>>({});
  private historySubject = new BehaviorSubject<Partial<InsuranceHistory>>({});

  public driver$ = this.driverSubject.asObservable();
  public vehicle$ = this.vehicleSubject.asObservable();
  public coverage$ = this.coverageSubject.asObservable();
  public history$ = this.historySubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  updateDriver(driver: Partial<Driver>): void {
    this.driverSubject.next({ ...this.driverSubject.value, ...driver });
    this.saveToLocalStorage();
  }

  updateVehicle(vehicle: Partial<Vehicle>): void {
    this.vehicleSubject.next({ ...this.vehicleSubject.value, ...vehicle });
    this.saveToLocalStorage();
  }

  updateCoverage(coverage: Partial<CoveragePreferences>): void {
    this.coverageSubject.next({ ...this.coverageSubject.value, ...coverage });
    this.saveToLocalStorage();
  }

  updateInsuranceHistory(history: Partial<InsuranceHistory>): void {
    this.historySubject.next({ ...this.historySubject.value, ...history });
    this.saveToLocalStorage();
  }

  getQuoteRequest(): QuoteRequest {
    return {
      driver: this.driverSubject.value as Driver,
      vehicle: this.vehicleSubject.value as Vehicle,
      coverage: this.coverageSubject.value as CoveragePreferences,
      insuranceHistory: this.historySubject.value as InsuranceHistory,
      requestDate: new Date()
    };
  }

  clearQuoteData(): void {
    this.driverSubject.next({});
    this.vehicleSubject.next({});
    this.coverageSubject.next({});
    this.historySubject.next({});
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private saveToLocalStorage(): void {
    const data = {
      driver: this.driverSubject.value,
      vehicle: this.vehicleSubject.value,
      coverage: this.coverageSubject.value,
      history: this.historySubject.value
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.driverSubject.next(data.driver || {});
        this.vehicleSubject.next(data.vehicle || {});
        this.coverageSubject.next(data.coverage || {});
        this.historySubject.next(data.history || {});
      } catch (error) {
        console.error('Error loading quote data from localStorage:', error);
      }
    }
  }
}
