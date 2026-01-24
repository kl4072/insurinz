import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ExtractionResult, ExtractedField } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DocumentExtractionService {

  extractDocument(file: File): Observable<ExtractionResult> {
    // Simulate API delay
    const mockResult = this.generateMockExtraction(file);
    return of(mockResult).pipe(delay(1500));
  }

  private generateMockExtraction(file: File): ExtractionResult {
    const fileName = file.name.toLowerCase();

    // Determine document type based on filename hints
    let documentType: 'policy' | 'claim' | 'submission' | 'unknown' = 'unknown';

    if (fileName.includes('policy') || fileName.includes('certificate') || fileName.includes('coverage')) {
      documentType = 'policy';
    } else if (fileName.includes('claim') || fileName.includes('loss') || fileName.includes('incident')) {
      documentType = 'claim';
    } else if (fileName.includes('submission') || fileName.includes('application') || fileName.includes('quote')) {
      documentType = 'submission';
    } else {
      // Random assignment for demo purposes
      const types: ('policy' | 'claim' | 'submission')[] = ['policy', 'claim', 'submission'];
      documentType = types[Math.floor(Math.random() * types.length)];
    }

    return {
      documentType,
      confidence: 0.85 + Math.random() * 0.14,
      extractedFields: this.getMockFieldsForType(documentType)
    };
  }

  private getMockFieldsForType(type: 'policy' | 'claim' | 'submission' | 'unknown'): ExtractedField[] {
    switch (type) {
      case 'policy':
        return [
          { fieldName: 'Policy Number', value: 'POL-2024-' + Math.floor(Math.random() * 900000 + 100000), confidence: 0.98 },
          { fieldName: 'Policy Holder', value: 'John Smith', confidence: 0.95 },
          { fieldName: 'Coverage Type', value: 'Comprehensive Auto Insurance', confidence: 0.92 },
          { fieldName: 'Effective Date', value: '01/15/2024', confidence: 0.97 },
          { fieldName: 'Expiration Date', value: '01/15/2025', confidence: 0.97 },
          { fieldName: 'Premium Amount', value: '$1,250.00', confidence: 0.94 },
          { fieldName: 'Deductible', value: '$500.00', confidence: 0.93 },
          { fieldName: 'Coverage Limit', value: '$100,000/$300,000', confidence: 0.91 }
        ];

      case 'claim':
        return [
          { fieldName: 'Claim Number', value: 'CLM-' + Math.floor(Math.random() * 900000 + 100000), confidence: 0.98 },
          { fieldName: 'Date of Loss', value: '12/10/2024', confidence: 0.96 },
          { fieldName: 'Claimant Name', value: 'John Smith', confidence: 0.94 },
          { fieldName: 'Loss Description', value: 'Rear-end collision at intersection', confidence: 0.88 },
          { fieldName: 'Claim Amount', value: '$4,500.00', confidence: 0.92 },
          { fieldName: 'Claim Status', value: 'Under Review', confidence: 0.95 },
          { fieldName: 'Adjuster Assigned', value: 'Jane Doe', confidence: 0.90 },
          { fieldName: 'Police Report #', value: 'PR-2024-78543', confidence: 0.87 }
        ];

      case 'submission':
        return [
          { fieldName: 'Application ID', value: 'APP-' + Math.floor(Math.random() * 900000 + 100000), confidence: 0.97 },
          { fieldName: 'Applicant Name', value: 'John Smith', confidence: 0.96 },
          { fieldName: 'Application Date', value: '01/05/2024', confidence: 0.98 },
          { fieldName: 'Requested Coverage', value: 'Full Coverage Auto', confidence: 0.91 },
          { fieldName: 'Vehicle Year', value: '2022', confidence: 0.95 },
          { fieldName: 'Vehicle Make', value: 'Toyota', confidence: 0.94 },
          { fieldName: 'Vehicle Model', value: 'Camry', confidence: 0.94 },
          { fieldName: 'Estimated Premium', value: '$1,100.00 - $1,400.00', confidence: 0.85 }
        ];

      default:
        return [
          { fieldName: 'Document Type', value: 'Unknown', confidence: 0.50 },
          { fieldName: 'Note', value: 'Unable to classify document. Please specify document type.', confidence: 1.0 }
        ];
    }
  }
}
