export interface Driver {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  licenseNumber: string;
  licenseState: string;
  licenseIssueDate: Date;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  drivingHistory: DrivingHistory;
}

export interface DrivingHistory {
  yearsLicensed: number;
  accidents: Accident[];
  violations: Violation[];
  dui: boolean;
}

export interface Accident {
  date: Date;
  type: 'at-fault' | 'not-at-fault';
  description: string;
  claimAmount?: number;
}

export interface Violation {
  date: Date;
  type: 'speeding' | 'reckless-driving' | 'running-red-light' | 'other';
  description: string;
  points?: number;
}
