import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'countries',
    loadComponent: () =>
      import('./countries/country-list/country-list.component')
        .then(m => m.CountryListComponent)
  },
  {
    path: '',
    redirectTo: 'countries',
    pathMatch: 'full'
  }
];
