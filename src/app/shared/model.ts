export type SortKey = 'name' | 'population' | 'area';

export const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Name (A–Z)',        value: 'name'       },
  { label: 'Population',        value: 'population' },
  { label: 'Area (km²)',        value: 'area'       },
];

export const REGIONS: string[] = [
  'Africa',
  'Americas',
  'Antarctic',
  'Asia',
  'Europe',
  'Oceania',
];

export interface FilterValues {
  search: string;
  region: string | null;
  sortBy: SortKey;
}
