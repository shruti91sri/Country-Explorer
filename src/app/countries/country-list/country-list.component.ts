import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { CountryService } from '../../core/service/country.service';
import { CountryCardComponent } from '../country-card/country-card.component';
import { PDropdownComponent } from '../../shared/primeng-wrappers/dropdown/p-dropdown.component';
import { PInputTextComponent } from '../../shared/primeng-wrappers/input-text/p-input-text.component';
import { Country, REGIONS, SORT_OPTIONS, SortKey } from '../../shared/model';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CountryCardComponent,
    PDropdownComponent,
    PInputTextComponent
  ],
  templateUrl: './country-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent {
  private readonly countryService = inject(CountryService);

  readonly filterForm = new FormGroup({
    search: new FormControl<string>('',     { nonNullable: true }),
    region: new FormControl<string | null>(null),
    sortBy: new FormControl<SortKey>('name', { nonNullable: true }),
  });

  readonly loading = signal(true);
  readonly error   = signal<string | null>(null);
  //use tosignal to get the countries from the service
  readonly countries = toSignal(
    this.countryService.getAll().pipe(
      catchError(err => {
        this.error.set(err?.message ?? 'Failed to load countries. Please try again.');
        this.loading.set(false);
        return of<Country[]>([]);
      }),
      finalize(() => this.loading.set(false)),
    ),
    { initialValue: [] as Country[] },
  );

  readonly search = toSignal(
    this.filterForm.controls.search.valueChanges.pipe(
      debounceTime(300),
      map(v => (v ?? '').trim()),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  readonly region = toSignal(
    this.filterForm.controls.region.valueChanges,
    { initialValue: this.filterForm.controls.region.value },
  );

  readonly sortBy = toSignal(
    this.filterForm.controls.sortBy.valueChanges,
    { initialValue: this.filterForm.controls.sortBy.value },
  );

  readonly filteredCountries = computed(() => {
    const list = this.countries();
    const search = this.search();
    const region = this.region();
    const sortBy = this.sortBy();

    let result = [...list];
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(c => c.name.common.toLowerCase().includes(term));
    }
    if (region) result = result.filter(c => c.region === region);

    if (sortBy === 'name')            result.sort((a, b) => a.name.common.localeCompare(b.name.common));
    else if (sortBy === 'population') result.sort((a, b) => b.population - a.population);
    else if (sortBy === 'area')       result.sort((a, b) => b.area - a.area);

    return result;
  });

  regions = REGIONS;
  sortOptions = SORT_OPTIONS;

  clearFilters(): void {
    this.filterForm.reset({ search: '', region: null, sortBy: 'name' });
  }
}