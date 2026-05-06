import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../../shared/model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private readonly http = inject(HttpClient);

  getAll(): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,currencies,languages,borders,flags,cca3');
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
