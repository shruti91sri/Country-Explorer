import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'countries',
    loadComponent: () =>
      import('./countries/country-list/country-list.component')
        .then(m => m.CountryListComponent)
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('./countries/country-compare/country-compare.component')
        .then(m => m.CountryCompareComponent)
  },
  {
    path: '',
    redirectTo: 'countries',
    pathMatch: 'full'
  }
];
