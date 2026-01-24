import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage, UploadedFile, ExtractionResult } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.addWelcomeMessage();
  }

  private addWelcomeMessage(): void {
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      type: 'bot',
      text: 'Hello! I can help you extract information from your insurance documents. Upload a policy, claim, or submission document and I\'ll analyze it for you.',
      timestamp: new Date()
    };
    this.messagesSubject.next([welcomeMessage]);
  }

  addUserMessage(text: string, files?: UploadedFile[]): ChatMessage {
    const message: ChatMessage = {
      id: this.generateId(),
      type: 'user',
      text,
      timestamp: new Date(),
      files
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
    return message;
  }

  addBotMessage(text: string, extractionResult?: ExtractionResult): ChatMessage {
    const message: ChatMessage = {
      id: this.generateId(),
      type: 'bot',
      text,
      timestamp: new Date(),
      extractionResult
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
    return message;
  }

  addLoadingMessage(): string {
    const message: ChatMessage = {
      id: this.generateId(),
      type: 'bot',
      text: 'Analyzing document...',
      timestamp: new Date(),
      isLoading: true
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
    return message.id;
  }

  updateMessage(id: string, updates: Partial<ChatMessage>): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = currentMessages.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    );
    this.messagesSubject.next(updatedMessages);
  }

  removeMessage(id: string): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next(currentMessages.filter(msg => msg.id !== id));
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
    this.addWelcomeMessage();
  }

  private generateId(): string {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
