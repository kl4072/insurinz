export interface InsuranceHistory {
  currentlyInsured: boolean;
  currentInsurer?: string;
  policyExpirationDate?: Date;
  continuousCoverage: boolean;
  yearsWithCurrentInsurer?: number;
  lapseInCoverage: boolean;
  lapseReason?: string;
  claims: Claim[];
}

export interface Claim {
  date: Date;
  type: 'collision' | 'comprehensive' | 'liability' | 'other';
  description: string;
  amountPaid: number;
  atFault: boolean;
}
