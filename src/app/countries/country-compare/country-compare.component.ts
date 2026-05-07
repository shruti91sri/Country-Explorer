import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { CountryService } from '../../core/service/country.service';
import { Country } from '../../shared/model';

@Component({
  selector: 'app-country-compare',
  standalone: true,
  imports: [FormsModule, MultiSelectModule, TableModule],
  templateUrl: './country-compare.component.html',
  styleUrl: './country-compare.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryCompareComponent {
  private readonly countryService = inject(CountryService);

  readonly MAX_SELECTABLE = 3;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  // countries selected by the user from the dropdown
  readonly selectedCodes = signal<string[]>([]);
  // get all countries from the service
  private readonly countries = toSignal(
    this.countryService.getAllWithTimeZone().pipe(
      catchError(err => {
        this.error.set(err?.message ?? 'Failed to load countries.');
        return of<Country[]>([]);
      }),
      finalize(() => this.loading.set(false)),
    ),
    { initialValue: [] as Country[] },
  );

  //map countries by code
  private readonly countriesByCode = computed(
    () => new Map(this.countries().map(c => [c.cca3, c])),
  );
 // populate the dropdown options from the countries list + sort them by name
  readonly options = computed(() =>
    [...this.countries()]
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
      .map(c => ({ label: c.name.common, value: c.cca3 })),
  );

  // get the selected countries details that were selected in the dropdown
  readonly selectedCountries = computed(() => {
    const countryCodeList = this.countriesByCode();
    return this.selectedCodes()
      .map(code => countryCodeList.get(code))
      .filter((c): c is Country => !!c);//check if the country is not null
  });
 // prepare country data for the comparision table
  readonly comparisonRows = computed(() => {
    const countries = this.selectedCountries();
    return [
      { label: 'Capital',    values: countries.map(c => c.capital?.[0] ?? 'N/A') },
      { label: 'Region',     values: countries.map(c => c.region) },
      { label: 'Population', values: countries.map(c => c.population.toLocaleString()) },
      { label: 'Area (km²)', values: countries.map(c => c.area.toLocaleString()) },
      { label: 'Currencies', values: countries.map(c => this.getCurrencies(c)) },
      { label: 'Languages',  values: countries.map(c => this.getLanguages(c)) },
      { label: 'Timezones',  values: countries.map(c => c.timezones?.join(', ') || 'N/A' ) },
      { label: 'Borders',    values: countries.map(c => this.getBorderNames(c)) },
    ];
  });

  // remove the country from the selected countries list
  remove(cca3: string): void {
    this.selectedCodes.update(codes => codes.filter(c => c !== cca3));
  }

  // get the currencies of the country
  private getCurrencies(c: Country): string {
    if (!c.currencies) return 'N/A';
    return Object.values(c.currencies).map(cur => cur.name).join(', ');
  }

  // get the languages of the country
  private getLanguages(c: Country): string {
    if (!c.languages) return 'N/A';
    return Object.values(c.languages).join(', ');
  }

  // get the borders of the country
  private getBorderNames(c: Country): string {
    if (!c.borders?.length) return 'None';
    const countryCodeList = this.countriesByCode();
    return c.borders
      .map(code => countryCodeList.get(code)?.name.common ?? code)
      .join(', ');
  }
}
