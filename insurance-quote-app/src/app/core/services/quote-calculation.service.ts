import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Quote, QuoteRequest, Premium, CoverageBreakdown, Discount, RiskFactors } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuoteCalculationService {

  calculateQuote(request: QuoteRequest): Observable<Quote> {
    return of(this.performCalculation(request)).pipe(delay(1500));
  }

  private performCalculation(request: QuoteRequest): Quote {
    const basePremium = this.calculateBasePremium(request.vehicle, request.coverage);
    const riskFactors = this.calculateRiskFactors(request);
    const riskMultiplier = 1 + riskFactors.overallRisk;
    const discounts = this.calculateDiscounts(request);
    const totalDiscount = discounts.reduce((sum, d) => sum + d.amount, 0);

    const annualPremium = (basePremium * riskMultiplier) - totalDiscount;
    const sixMonthPremium = annualPremium / 2;
    const monthlyPremium = annualPremium / 12;

    const coverageBreakdown = this.buildCoverageBreakdown(request.coverage, basePremium);

    return {
      quoteId: this.generateQuoteId(),
      request,
      premium: {
        monthlyPremium: Math.round(monthlyPremium * 100) / 100,
        sixMonthPremium: Math.round(sixMonthPremium * 100) / 100,
        annualPremium: Math.round(annualPremium * 100) / 100,
        totalDiscount: Math.round(totalDiscount * 100) / 100
      },
      coverageBreakdown,
      discounts,
      calculationDate: new Date(),
      expirationDate: this.addDays(new Date(), 30)
    };
  }

  private calculateBasePremium(vehicle: any, coverage: any): number {
    let base = 800;

    const vehicleAge = new Date().getFullYear() - vehicle.year;
    if (vehicleAge < 3) base += 200;
    else if (vehicleAge > 10) base -= 100;

    const bodyTypeMultipliers: any = {
      'sedan': 1.0,
      'suv': 1.1,
      'truck': 1.15,
      'coupe': 1.3,
      'van': 1.05,
      'other': 1.1
    };
    base *= (bodyTypeMultipliers[vehicle.bodyType] || 1.0);

    if (vehicle.annualMileage > 15000) base += 150;
    else if (vehicle.annualMileage < 7500) base -= 100;

    if (coverage.collision?.enabled) {
      base += 400;
      if (coverage.collision.deductible < 1000) base += 100;
    }

    if (coverage.comprehensive?.enabled) {
      base += 300;
      if (coverage.comprehensive.deductible < 1000) base += 75;
    }

    base += (coverage.liability.bodilyInjuryPerPerson / 1000);

    return base;
  }

  private calculateRiskFactors(request: QuoteRequest): RiskFactors {
    const driver = request.driver;
    const history = request.insuranceHistory;

    let driverRisk = 0;
    if (driver.age < 25) driverRisk += 0.3;
    else if (driver.age > 65) driverRisk += 0.1;

    if (driver.drivingHistory.yearsLicensed < 5) driverRisk += 0.2;

    const accidentCount = driver.drivingHistory.accidents?.filter(a => a.type === 'at-fault').length || 0;
    driverRisk += accidentCount * 0.15;

    const violationCount = driver.drivingHistory.violations?.length || 0;
    driverRisk += violationCount * 0.1;

    if (driver.drivingHistory.dui) driverRisk += 0.5;

    let vehicleRisk = 0;
    if (request.vehicle.bodyType === 'coupe') vehicleRisk += 0.4;
    if (request.vehicle.annualMileage > 15000) vehicleRisk += 0.15;
    if (request.vehicle.antiTheftDevices) vehicleRisk -= 0.05;

    let historyRisk = 0;
    if (history?.lapseInCoverage) historyRisk += 0.2;
    const claimCount = history?.claims?.length || 0;
    historyRisk += claimCount * 0.1;
    if (history?.yearsWithCurrentInsurer && history.yearsWithCurrentInsurer > 5) historyRisk -= 0.05;

    const overallRisk = (driverRisk + vehicleRisk + historyRisk) / 3;

    return {
      driverRisk,
      vehicleRisk,
      coverageRisk: 0,
      historyRisk,
      overallRisk
    };
  }

  private calculateDiscounts(request: QuoteRequest): Discount[] {
    const discounts: Discount[] = [];

    const hasNoAccidents = request.driver.drivingHistory.accidents?.length === 0;
    const hasNoViolations = request.driver.drivingHistory.violations?.length === 0;
    if (hasNoAccidents && hasNoViolations) {
      discounts.push({
        type: 'good-driver',
        description: 'Good Driver Discount',
        amount: 150,
        percentage: 20
      });
    }

    if (request.insuranceHistory?.continuousCoverage &&
        request.insuranceHistory.yearsWithCurrentInsurer &&
        request.insuranceHistory.yearsWithCurrentInsurer > 3) {
      discounts.push({
        type: 'continuous-coverage',
        description: 'Continuous Coverage Discount',
        amount: 100,
        percentage: 10
      });
    }

    if (request.vehicle.annualMileage < 7500) {
      discounts.push({
        type: 'low-mileage',
        description: 'Low Mileage Discount',
        amount: 75,
        percentage: 10
      });
    }

    if (request.vehicle.safetyFeatures?.length > 3) {
      discounts.push({
        type: 'safety-features',
        description: 'Safety Features Discount',
        amount: 50,
        percentage: 5
      });
    }

    return discounts;
  }

  private buildCoverageBreakdown(coverage: any, basePremium: number): CoverageBreakdown[] {
    const breakdown: CoverageBreakdown[] = [];

    breakdown.push({
      coverageType: 'Liability',
      description: `${coverage.liability.bodilyInjuryPerPerson}/${coverage.liability.bodilyInjuryPerAccident}/${coverage.liability.propertyDamage}`,
      premium: basePremium * 0.4
    });

    if (coverage.collision?.enabled) {
      breakdown.push({
        coverageType: 'Collision',
        description: `$${coverage.collision.deductible} deductible`,
        premium: basePremium * 0.3
      });
    }

    if (coverage.comprehensive?.enabled) {
      breakdown.push({
        coverageType: 'Comprehensive',
        description: `$${coverage.comprehensive.deductible} deductible`,
        premium: basePremium * 0.2
      });
    }

    if (coverage.personalInjuryProtection) {
      breakdown.push({
        coverageType: 'Personal Injury Protection',
        description: 'PIP Coverage',
        premium: 75
      });
    }

    if (coverage.uninsuredMotoristCoverage) {
      breakdown.push({
        coverageType: 'Uninsured Motorist',
        description: 'UM/UIM Coverage',
        premium: 60
      });
    }

    if (coverage.roadsideAssistance) {
      breakdown.push({
        coverageType: 'Roadside Assistance',
        description: '24/7 Roadside Help',
        premium: 30
      });
    }

    if (coverage.rentalReimbursement) {
      breakdown.push({
        coverageType: 'Rental Reimbursement',
        description: 'Rental Car Coverage',
        premium: 40
      });
    }

    return breakdown;
  }

  private generateQuoteId(): string {
    return `Q-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
