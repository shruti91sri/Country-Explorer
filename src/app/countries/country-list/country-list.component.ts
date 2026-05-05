import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  templateUrl: './country-list.component.html'
})
export class CountryListComponent implements OnInit, OnDestroy {

  countries: any[] = [];
  filteredCountries: any[] = [];
  loading = false;
  subscription = new Subscription();
  // change to reactive forms
  readonly filterForm = new FormGroup({
    search: new FormControl<string>('',     { nonNullable: true }),
    region: new FormControl<string | null>(null),
    sortBy: new FormControl<SortKey>('name', { nonNullable: true }),
  });

  regions = REGIONS;
  sortOptions = SORT_OPTIONS;
  constructor(private countryService: CountryService) { }

  ngOnInit(): void {
    this.loadCountries();

    this.subscription.add(
      this.filterForm.get('search')!.valueChanges.subscribe((value: any) => {
        this.applyFilters();
      })
    );

    this.subscription.add(
      this.filterForm.get('region')!.valueChanges.subscribe((value: any) => {
        this.applyFilters();
      })
    );

    this.subscription.add(
      this.filterForm.get('sortBy')!.valueChanges.subscribe((value: any) => {
        this.applyFilters();
      })
    );
  }

  loadCountries(): void {
    this.loading = true;
    this.subscription.add(
      this.countryService.getAll().subscribe((data: any) => {
        this.countries = data;
        this.filteredCountries = data;
        this.loading = false;
        this.applyFilters();
      })
    );
  }

  applyFilters(): void {
    let result = [...this.countries];

    const searchTerm = this.filterForm.get('search')!.value;
    if (searchTerm) {
      result = result.filter((country: any) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const region = this.filterForm.get('region')!.value;
    if (region) {
      result = result.filter((country: any) => country.region === region);
    }

    const sortBy = this.filterForm.get('sortBy')!.value;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
