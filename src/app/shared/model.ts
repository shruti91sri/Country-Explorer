export type SortKey = 'name' | 'population' | 'area';

export const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Name (A–Z)',        value: 'name'       },
  { label: 'Population',        value: 'population' },
  { label: 'Area (km²)',        value: 'area'       },
];

export const REGIONS: { label: string; value: string }[] = [
  { label: 'Africa',    value: 'Africa'    },
  { label: 'Americas',  value: 'Americas'  },
  { label: 'Antarctic', value: 'Antarctic' },
  { label: 'Asia',      value: 'Asia'      },
  { label: 'Europe',    value: 'Europe'    },
  { label: 'Oceania',   value: 'Oceania'   },
];

export interface FilterValues {
  search: string;
  region: string | null;
  sortBy: SortKey;
}

export interface CountryName {
  common: string;
  official?: string;
}

export interface CountryCurrency {
  name: string;
  symbol?: string;
}

export interface CountryFlags {
  png: string;
  svg?: string;
  alt?: string;
}

export interface Country {
  cca3: string;
  name: CountryName;
  capital?: string[];
  region: string;
  population: number;
  area: number;
  flags: CountryFlags;
  currencies?: Record<string, CountryCurrency>;
  languages?: Record<string, string>;
  borders?: string[];
}
