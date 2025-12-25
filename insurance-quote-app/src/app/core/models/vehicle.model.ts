export interface Vehicle {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  bodyType: 'sedan' | 'suv' | 'truck' | 'coupe' | 'van' | 'other';
  primaryUse: 'commute' | 'business' | 'pleasure' | 'farm';
  annualMileage: number;
  ownership: 'owned' | 'leased' | 'financed';
  garagingAddress: Address;
  antiTheftDevices: boolean;
  safetyFeatures: string[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}
