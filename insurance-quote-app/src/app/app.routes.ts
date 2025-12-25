import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'quote',
    pathMatch: 'full'
  },
  {
    path: 'quote',
    loadComponent: () => import('./features/quote-wizard/components/wizard-container/wizard-container.component')
      .then(m => m.WizardContainerComponent)
  }
];
