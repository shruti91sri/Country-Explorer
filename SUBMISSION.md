# Submission.ms

## Code Review
Top issues 
1.All Region dropdown is empty.
2. Why is the app not standalone? app can be standalone and we don't need modules anymore.

Issues in `country-list.component.ts`
3.No interfaces — `countries`, `filteredCountries`, `sortOptions`.
4. `ngOnInit` is overloaded , no need to add subscription there(even why we have subscriptions)
Removed subscriptions and ngOnDestory, rather use `takeUntilDestroyed(destroyRef) ` it will automatically handle subscription and destorying
5. `UntypedFormGroup` is not required rather use `FormGroup` with `ControlValueAccessor`.It will make the form handling easy and we can reset the form directly rather than clearing each field.
6. No `trackBy` on `*ngFor="let country of filteredCountries"` in the template.
7.Should add `changedetection.onpush` , without it Change detection runs and checks every component on evry browser event, like searching .

Low priority issues
8.search box has no validation.
9. when i search with some text and delete charaters it executes on each keystrokes which is a heavy operation.Add `debouncetime`, `distinctUntilChanged` for future proofing.
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

## Tradeoffs

## Tradeoffs

1. **Pure pipes for population/currencies/languages** instead of an `@Input` setter or `computed()` signals.
   I had three options:
   - `@Input` setter → fastest, but the formatting logic is stuck inside one component.
   - `computed()` signals → clean, but ties display logic to the component.
   - **Pure pipes** → Angular only re-runs them when their input changes, so they're effectively free across change-detection cycles, and I can reuse them anywhere (compare page, future detail view).

   I picked pure pipes for the reuse. The per-cycle cost is negligible.
   *Capital stayed inline* (`country.capital?.[0] ?? 'N/A'`) — it's just a property read, no arrays or strings being built. Wrapping it in a pipe would add overhead for zero benefit. Knowing when **not** to apply a pattern matters as much as applying it.

2. **`forkJoin` without `shareReplay`** in `getAllWithTimeZone()`.
   `forkJoin` runs the two HTTP calls in parallel and gives me both results together. `shareReplay` would cache that result so re-subscribing doesn't trigger a new request — different job.
   I skipped the cache because:
   - the data only loads once per page visit anyway,
   - the API isn't truly static (timezones/borders can change),
   - a stale cache is harder to debug than one extra request.

   Easy to add later if a second consumer shows up. **Premature caching is a bug factory.**

3. **Two service methods: `getAll()` and `getAllWithTimeZone()`** instead of one method that always returns timezones.
   The REST Countries `/all` endpoint only lets you ask for 10 fields per call, but I needed 11 (timezones is the extra one). So `getAllWithTimeZone()` makes a second call just for `cca3,timezones` and merges the results.
   I kept this as a separate method so:
   - the **list page** stays on a single, lean request,
   - only **`/compare`** pays for the second call (since it's the only place that needs timezones).

   Cost is a slightly bigger service surface. **Pay for what you use.**

4. **Full migration to standalone + signals + zoneless + `OnPush`** instead of a small, surface-level refactor.
   This is a bigger change than strictly needed, but it removes a whole class of problems in one go:
   - no `NgModule` boilerplate (standalone components),
   - no manual `subscribe`/`unsubscribe` (`takeUntilDestroyed` handles it),
   - no `UntypedFormGroup`,
   - no zone.js triggering change detection on every random browser event.

   Cost: a steeper learning curve for anyone unfamiliar with signals and manual change detection. Accepted because this is the direction Angular itself is moving.

**What you'd do with more time**

I would have prioritised to add unit test.