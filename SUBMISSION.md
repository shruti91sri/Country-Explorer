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

