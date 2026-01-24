import { Component, Output, EventEmitter, ElementRef, ViewChild, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatService } from '../../../../core/services/chat.service';
import { DocumentExtractionService } from '../../../../core/services/document-extraction.service';
import { UploadedFile, SUPPORTED_FILE_TYPES, SUPPORTED_EXTENSIONS } from '../../../../core/models';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ChatMessageComponent
  ],
  template: `
    <div class="chat-panel">
      <!-- Header -->
      <div class="header">
        <div class="title">
          <mat-icon>smart_toy</mat-icon>
          <span>Document Extractor</span>
        </div>
        <button mat-icon-button (click)="close.emit()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Messages -->
      <div class="messages" #messagesContainer>
        <app-chat-message
          *ngFor="let message of messages$ | async"
          [message]="message">
        </app-chat-message>
      </div>

      <!-- Upload Area -->
      <div
        class="upload-area"
        [class.drag-over]="isDragOver"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()">
        <input
          #fileInput
          type="file"
          [accept]="acceptedTypes"
          multiple
          hidden
          (change)="onFileSelected($event)">
        <mat-icon>cloud_upload</mat-icon>
        <span>Drop files here or click to upload</span>
        <span class="formats">PDF, Images, Word, Excel</span>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <mat-form-field appearance="outline" class="message-input">
          <input
            matInput
            [(ngModel)]="messageText"
            placeholder="Type a message..."
            (keyup.enter)="sendMessage()">
        </mat-form-field>
        <button mat-icon-button color="primary" (click)="sendMessage()" [disabled]="!messageText.trim()">
          <mat-icon>send</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-panel {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #1976d2;
      color: white;

      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
      }

      button {
        color: white;
      }
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #fafafa;
    }

    .upload-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      margin: 0 16px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #fafafa;

      &:hover, &.drag-over {
        border-color: #1976d2;
        background: rgba(25, 118, 210, 0.05);
      }

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #1976d2;
        margin-bottom: 8px;
      }

      span {
        font-size: 13px;
        color: #666;
      }

      .formats {
        font-size: 11px;
        color: #999;
        margin-top: 4px;
      }
    }

    .input-area {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 8px;
      border-top: 1px solid #e0e0e0;

      .message-input {
        flex: 1;

        ::ng-deep .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }
      }
    }
  `]
})
export class ChatPanelComponent implements AfterViewChecked {
  @Output() close = new EventEmitter<void>();
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private chatService = inject(ChatService);
  private extractionService = inject(DocumentExtractionService);

  messageText = '';
  isDragOver = false;
  acceptedTypes = SUPPORTED_FILE_TYPES.join(',');

  get messages$() {
    return this.chatService.messages$;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.processFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.processFiles(Array.from(input.files));
      input.value = '';
    }
  }

  private processFiles(files: File[]): void {
    const validFiles = files.filter(file => this.isValidFile(file));

    if (validFiles.length === 0) {
      this.chatService.addBotMessage('Sorry, none of the uploaded files are in a supported format. Please upload PDF, images, Word, or Excel files.');
      return;
    }

    const uploadedFiles: UploadedFile[] = validFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      file
    }));

    // Add user message with files
    this.chatService.addUserMessage(
      `Uploaded ${validFiles.length} file${validFiles.length > 1 ? 's' : ''} for extraction`,
      uploadedFiles
    );

    // Process each file
    validFiles.forEach(file => {
      const loadingId = this.chatService.addLoadingMessage();

      this.extractionService.extractDocument(file).subscribe({
        next: (result) => {
          this.chatService.removeMessage(loadingId);
          this.chatService.addBotMessage(
            `I've analyzed "${file.name}" and extracted the following information:`,
            result
          );
        },
        error: () => {
          this.chatService.removeMessage(loadingId);
          this.chatService.addBotMessage(`Sorry, I couldn't process "${file.name}". Please try again.`);
        }
      });
    });
  }

  private isValidFile(file: File): boolean {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    return SUPPORTED_FILE_TYPES.includes(file.type) || SUPPORTED_EXTENSIONS.includes(extension);
  }

  sendMessage(): void {
    const text = this.messageText.trim();
    if (!text) return;

    this.chatService.addUserMessage(text);
    this.messageText = '';

    // Simple response for text messages
    setTimeout(() => {
      this.chatService.addBotMessage(
        'To extract document information, please upload a file using the upload area above. I support PDF, images, Word documents, and Excel files.'
      );
    }, 500);
  }
}
