import { Driver } from './driver.model';
import { Vehicle } from './vehicle.model';
import { CoveragePreferences } from './coverage.model';
import { InsuranceHistory } from './insurance-history.model';

export interface QuoteRequest {
  driver: Driver;
  vehicle: Vehicle;
  coverage: CoveragePreferences;
  insuranceHistory?: InsuranceHistory;
  requestDate?: Date;
}

export interface Quote {
  quoteId: string;
  request: QuoteRequest;
  premium: Premium;
  coverageBreakdown: CoverageBreakdown[];
  discounts: Discount[];
  calculationDate: Date;
  expirationDate: Date;
}

export interface Premium {
  monthlyPremium: number;
  sixMonthPremium: number;
  annualPremium: number;
  totalDiscount: number;
}

export interface CoverageBreakdown {
  coverageType: string;
  description: string;
  premium: number;
}

export interface Discount {
  type: string;
  description: string;
  amount: number;
  percentage: number;
}

export interface RiskFactors {
  driverRisk: number;
  vehicleRisk: number;
  coverageRisk: number;
  historyRisk: number;
  overallRisk: number;
}
