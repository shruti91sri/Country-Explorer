# Submisiion.ms

## Code Review

1.All Region dropdown is empty.
2. Why is the app not standalone? app can be standalone and we don't need modules anymore.

Issues in `country-list.component.ts`
3.No interfaces — `countries`, `filteredCountries`, `sortOptions`.
4. `ngOnInit` is overloaded , no need to add subscription there(even why we have subscriptions)
Removed subscriptions and ngOnDestory, rather use `takeUntilDestroyed(destroyRef) ` it will automatically handle subscription and destorying
5. `UntypedFormGroup` is not required rather use `FormGroup` with `ControlValueAccessor`.It will make the form handling easy and we can reset the form directly rather than clearing each field.

6.search box has no validation.
7. when i search with some text and delete charaters it executes on each keystrokes which is a heavy operation.Add `debouncetime`, `distinctUntilChanged` for future proofing.

8. No `trackBy` on `*ngFor="let country of filteredCountries"` in the template.
9.Should add `changedetection.onpush` , without it Change detection runs and checks every component on evry browser event, like searching .
10. i see usage of `*ngIf`, `*ngFor` those are deprecated and long gone. It should be replaced by `@if @for`
11. No need for constructor  with Angular 19 we can use `inject()` for dependency injection.


## Add Comparision Page

Implemented Compare Page keeping the requirement in mind

Requirements:
- New route: `/compare`
- Country selector (users pick which countries to compare)
- Side-by-side display of key data: population, area, capital, region, currencies, languages, timezones, borders

## Performance improvement

1. **Lazy-loaded flag images** — added `loading="lazy"`, `decoding="async"`on the country card `<img>`. Initial flag requests dropped from 250 to average 11, eliminated layout shift, and improved a11y with a per-country `alt`.

2. The template in country-card.component.html binds to method calls (getPopulation(), getCurrencies(), getLanguages()) and an inline ternary for capital. Angular re-evaluates every template expression on each change-detection cycle — OnPush only controls when the component is checked, not what runs during that check. So each cycle, getCurrencies() and getLanguages() allocate two fresh arrays (Object.values, .map) and a new joined string, even though the country input is immutable. Across ~250 cards that's thousands of throwaway allocations per tick, adding GC pressure for zero benefit. The right pattern is to derive these display values once in the @Input setter (or via pure pipes / computed() signals) and bind to plain fields, so the template does pure identity checks instead of recomputation.
Solution: implement pure pipes.