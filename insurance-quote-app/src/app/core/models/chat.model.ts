export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  files?: UploadedFile[];
  extractionResult?: ExtractionResult;
  isLoading?: boolean;
}

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  file?: File;
}

export interface ExtractionResult {
  documentType: 'policy' | 'claim' | 'submission' | 'unknown';
  confidence: number;
  extractedFields: ExtractedField[];
}

export interface ExtractedField {
  fieldName: string;
  value: string;
  confidence: number;
}

export type DocumentType = 'policy' | 'claim' | 'submission';

export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export const SUPPORTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx', '.xls', '.xlsx'];
