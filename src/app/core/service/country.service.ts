import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../../shared/model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private readonly http = inject(HttpClient);

  getAll(): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,currencies,languages,borders,flags,cca3');
  }
  //get all countries with timezones
  getAllWithTimeZone(): Observable<Country[]> {
    return forkJoin({
      base: this.getAll(),
      extra: this.http.get<Pick<Country, 'cca3' | 'timezones'>[]>(
        'https://restcountries.com/v3.1/all?fields=cca3,timezones'
      ),
    }).pipe(
      map(({ base, extra }) => {
        const tzByCode = new Map(extra.map(c => [c.cca3, c.timezones]));
        return base.map(c => ({ ...c, timezones: tzByCode.get(c.cca3) ?? [] }));
      })
    );
  }

  getByCode(code: string): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/alpha/' + code);
  }

  searchByName(name: string): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/name/' + name);
  }

  getByRegion(region: string): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/region/' + region);
  }

  getByCodes(codes: string[]): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/alpha?codes=' + codes.join(','));
  }
}
