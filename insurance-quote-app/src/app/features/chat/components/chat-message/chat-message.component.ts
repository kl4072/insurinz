import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatMessage } from '../../../../core/models';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="message" [class.user]="message.type === 'user'" [class.bot]="message.type === 'bot'">
      <div class="message-content">
        <!-- Loading state -->
        <div *ngIf="message.isLoading" class="loading">
          <mat-spinner diameter="20"></mat-spinner>
          <span>{{ message.text }}</span>
        </div>

        <!-- Regular message -->
        <div *ngIf="!message.isLoading">
          <p class="text">{{ message.text }}</p>

          <!-- File attachments -->
          <div *ngIf="message.files?.length" class="files">
            <div *ngFor="let file of message.files" class="file-chip">
              <mat-icon>{{ getFileIcon(file.type) }}</mat-icon>
              <span>{{ file.name }}</span>
            </div>
          </div>

          <!-- Extraction results -->
          <div *ngIf="message.extractionResult" class="extraction-result">
            <div class="result-header">
              <mat-icon>analytics</mat-icon>
              <span class="doc-type">{{ formatDocType(message.extractionResult.documentType) }}</span>
              <span class="confidence">({{ (message.extractionResult.confidence * 100).toFixed(0) }}% confidence)</span>
            </div>
            <table class="fields-table">
              <tr *ngFor="let field of message.extractionResult.extractedFields">
                <td class="field-name">{{ field.fieldName }}</td>
                <td class="field-value">{{ field.value }}</td>
              </tr>
            </table>
          </div>
        </div>

        <span class="timestamp">{{ message.timestamp | date:'shortTime' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .message {
      display: flex;
      margin-bottom: 12px;

      &.user {
        justify-content: flex-end;

        .message-content {
          background: #1976d2;
          color: white;
          border-radius: 16px 16px 4px 16px;
        }

        .timestamp {
          color: rgba(255, 255, 255, 0.7);
        }
      }

      &.bot {
        justify-content: flex-start;

        .message-content {
          background: #f5f5f5;
          color: #333;
          border-radius: 16px 16px 16px 4px;
        }

        .timestamp {
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }

    .message-content {
      max-width: 85%;
      padding: 10px 14px;
    }

    .text {
      margin: 0 0 4px 0;
      line-height: 1.4;
      white-space: pre-wrap;
    }

    .timestamp {
      font-size: 10px;
      display: block;
      text-align: right;
    }

    .loading {
      display: flex;
      align-items: center;
      gap: 10px;

      span {
        font-style: italic;
      }
    }

    .files {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 8px 0;
    }

    .file-chip {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .extraction-result {
      margin-top: 12px;
      background: white;
      border-radius: 8px;
      padding: 12px;
      border: 1px solid #e0e0e0;
    }

    .result-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e0e0e0;

      mat-icon {
        color: #1976d2;
      }

      .doc-type {
        font-weight: 500;
        color: #1976d2;
      }

      .confidence {
        font-size: 12px;
        color: #666;
      }
    }

    .fields-table {
      width: 100%;
      font-size: 13px;

      tr:not(:last-child) td {
        padding-bottom: 6px;
      }

      .field-name {
        color: #666;
        padding-right: 12px;
        white-space: nowrap;
      }

      .field-value {
        color: #333;
        font-weight: 500;
      }
    }
  `]
})
export class ChatMessageComponent {
  @Input() message!: ChatMessage;

  getFileIcon(type: string): string {
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('image')) return 'image';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('excel') || type.includes('sheet')) return 'table_chart';
    return 'insert_drive_file';
  }

  formatDocType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1) + ' Document';
  }
}
