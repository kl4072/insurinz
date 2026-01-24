import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatPanelComponent } from '../chat-panel/chat-panel.component';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ChatPanelComponent],
  template: `
    <!-- Chat Panel -->
    <div class="panel-container" *ngIf="isOpen">
      <app-chat-panel (close)="toggle()"></app-chat-panel>
    </div>

    <!-- Floating Button -->
    <button
      mat-fab
      color="primary"
      class="chat-fab"
      (click)="toggle()"
      [class.open]="isOpen">
      <mat-icon>{{ isOpen ? 'close' : 'chat' }}</mat-icon>
    </button>
  `,
  styles: [`
    :host {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }

    .chat-fab {
      width: 56px;
      height: 56px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }

      &.open {
        background: #f44336;
      }
    }

    .panel-container {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 380px;
      height: 520px;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 480px) {
      :host {
        bottom: 16px;
        right: 16px;
      }

      .panel-container {
        position: fixed;
        top: 16px;
        left: 16px;
        right: 16px;
        bottom: 88px;
        width: auto;
        height: auto;
      }
    }
  `]
})
export class ChatWidgetComponent {
  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
