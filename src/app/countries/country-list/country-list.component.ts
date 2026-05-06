import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../../core/service/country.service';
import { CountryCardComponent } from '../country-card/country-card.component';
import { PDropdownComponent } from '../../shared/primeng-wrappers/dropdown/p-dropdown.component';
import { PInputTextComponent } from '../../shared/primeng-wrappers/input-text/p-input-text.component';
import { REGIONS, SORT_OPTIONS, SortKey } from '../../shared/model';

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
export class CountryListComponent implements OnInit {

  private readonly countryService = inject(CountryService);
  private readonly destroyRef = inject(DestroyRef);

  countries: any[] = [];
  filteredCountries: any[] = [];
  loading = false;

  // change to reactive forms
  readonly filterForm = new FormGroup({
    search: new FormControl<string>('',     { nonNullable: true }),
    region: new FormControl<string | null>(null),
    sortBy: new FormControl<SortKey>('name', { nonNullable: true }),
  });

  regions = REGIONS;
  sortOptions = SORT_OPTIONS;

  ngOnInit(): void {
    this.loadCountries();

    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyFilters());
  }

  loadCountries(): void {
    this.loading = true;
    this.countryService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.countries = data;
        this.filteredCountries = data;
        this.loading = false;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    const { search, region, sortBy } = this.filterForm.getRawValue();
    let result = [...this.countries];

    if (search) {
      const term = search.toLowerCase();
      result = result.filter((country: any) =>
        country.name.common.toLowerCase().includes(term)
      );
    }

    if (region) {
      result = result.filter((country: any) => country.region === region);
    }

    if (sortBy === 'name') {
      result.sort((a: any, b: any) => a.name.common.localeCompare(b.name.common));
    } else if (sortBy === 'population') {
      result.sort((a: any, b: any) => b.population - a.population);
    } else if (sortBy === 'area') {
      result.sort((a: any, b: any) => b.area - a.area);
    }

    this.filteredCountries = result;
  }

  clearFilters(): void {
    //reset the form to initial values
    this.filterForm.reset({ search: '', region: null, sortBy: 'name' });
  }
}
