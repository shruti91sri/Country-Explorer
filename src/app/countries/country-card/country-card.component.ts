import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from '../../shared/model';
import {
  CurrenciesPipe,
  LanguagesPipe,
  PopulationPipe,
} from '../../shared/pipes/country-format.pipes';

@Component({
  selector: 'app-country-card',
  standalone: true,
  templateUrl: './country-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PopulationPipe, CurrenciesPipe, LanguagesPipe],
})
export class CountryCardComponent {

  @Input({ required: true }) country!: Country;
  private readonly router = inject(Router)

  onCardClick(): void {
    console.log('Country clicked:', this.country.name.common);
  }
}
