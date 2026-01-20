import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="landing-container">
      <div class="hero">
        <div class="hero-content">
          <h1>Get Your Auto Insurance Quote in Minutes</h1>
          <p class="tagline">Fast, easy, and no obligation. See how much you could save.</p>
          <button mat-raised-button color="primary" class="cta-button" routerLink="/quote">
            <mat-icon>directions_car</mat-icon>
            Get Your Quote
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
    }

    .hero {
      text-align: center;
      padding: 24px;
    }

    .hero-content {
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      color: white;
      font-size: 2.5rem;
      font-weight: 500;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .tagline {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.25rem;
      margin: 0 0 32px 0;
      line-height: 1.5;
    }

    .cta-button {
      font-size: 1.125rem;
      padding: 12px 32px;
      height: auto;

      mat-icon {
        margin-right: 8px;
      }
    }

    @media (max-width: 600px) {
      h1 {
        font-size: 1.75rem;
      }

      .tagline {
        font-size: 1rem;
      }

      .cta-button {
        font-size: 1rem;
        padding: 10px 24px;
      }
    }
  `]
})
export class LandingPageComponent {}
