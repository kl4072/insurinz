import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing-page.component')
      .then(m => m.LandingPageComponent)
  },
  {
    path: 'quote',
    loadComponent: () => import('./features/quote-wizard/components/wizard-container/wizard-container.component')
      .then(m => m.WizardContainerComponent)
  }
];
