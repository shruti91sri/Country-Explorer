# Submisiion.ms

## Code Review

1.All Region dropdown is empty.
2. Why is the app not standalone? app can be standalone and we don't need modules anymore.
3. don't see purpose of Countries link in header as we are not navigating away from the page.
4. Checking on Network tab PNG images are not cached so they are being called again when you filter out in the search box or region. then you start changing your search query, it calls all the images again.

Issues in `country-list.component.ts`
5.No interfaces — `countries`, `filteredCountries`, `sortOptions`.
6. `ngOnInit` is overloaded , no need to add subscription there(even why we have subscriptions)
Removed subscriptions and ngOnDestory, rather use `takeUntilDestroyed(destroyRef) ` it will automatically handle subscription and destorying
7. `UntypedFormGroup` is not required rather use `FormGroup` with `ControlValueAccessor`.It will make the form handling easy and we can reset the form directly rather than clearing each field.

8.search box has no validation.
9. when i search with some text and delete charaters the whole country list reloads.Add `debouncetime`, `distinctUntilChanged`

10. No `trackBy` on `*ngFor="let country of filteredCountries"` in the template.
11.Should add `changedetection.onpush` , without it Change detection runs and checks every component on evry browser event, like searching .
12. don't see purpose of Countries link in header as we are not navigating away from the page.
13. i see usage of `*ngIf`, `*ngFor` those are deprecated and long gone. It should be replaced by `@if @for`
14. No need for constructor  with Angular 19 we can use `inject()` for dependency injection.