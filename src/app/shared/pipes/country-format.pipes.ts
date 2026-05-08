import { Pipe, PipeTransform } from '@angular/core';
import { CountryCurrency } from '../model';

@Pipe({ name: 'population', standalone: true, pure: true })
export class PopulationPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return 'N/A';
    if (value > 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value > 1_000) return (value / 1_000).toFixed(1) + 'K';
    return value.toString();
  }
}

@Pipe({ name: 'currencies', standalone: true, pure: true })
export class CurrenciesPipe implements PipeTransform {
  transform(value: Record<string, CountryCurrency> | null | undefined): string {
    if (!value) return 'N/A';
    return Object.values(value).map(c => c.name).join(', ');
  }
}

@Pipe({ name: 'languages', standalone: true, pure: true })
export class LanguagesPipe implements PipeTransform {
  transform(value: Record<string, string> | null | undefined): string {
    if (!value) return 'N/A';
    return Object.values(value).join(', ');
  }
}
