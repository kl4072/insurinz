export interface CoveragePreferences {
  liability: LiabilityCoverage;
  collision: CollisionCoverage | null;
  comprehensive: ComprehensiveCoverage | null;
  personalInjuryProtection: boolean;
  uninsuredMotoristCoverage: boolean;
  medicalPayments?: MedicalPaymentsCoverage;
  rentalReimbursement: boolean;
  roadsideAssistance: boolean;
}

export interface LiabilityCoverage {
  bodilyInjuryPerPerson: number;
  bodilyInjuryPerAccident: number;
  propertyDamage: number;
}

export interface CollisionCoverage {
  enabled: boolean;
  deductible: number;
}

export interface ComprehensiveCoverage {
  enabled: boolean;
  deductible: number;
}

export interface MedicalPaymentsCoverage {
  enabled: boolean;
  limit: number;
}

export type CoverageLimit = 25000 | 50000 | 100000 | 250000 | 500000;
export type Deductible = 250 | 500 | 1000 | 2000 | 5000;
