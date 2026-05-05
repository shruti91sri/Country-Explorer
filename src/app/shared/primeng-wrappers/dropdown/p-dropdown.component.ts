import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-p-dropdown',
  standalone: true,
  imports: [FormsModule, SelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PDropdownComponent),
      multi: true,
    },
  ],
  template: `
    <p-select
      [options]="$any(options)"
      [ngModel]="value"
      [placeholder]="placeholder"
      [optionLabel]="optionLabel"
      [optionValue]="optionValue"
      [showClear]="showClear"
      (ngModelChange)="onSelect($event)"
      [style]="{ width: '100%' }">
    </p-select>
  `
})
export class PDropdownComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() value: any;
  @Input() placeholder = '';
  @Input() optionLabel = '';
  @Input() optionValue = '';
  @Input() showClear = false;
  onChange: (val: unknown) => void = () => {};
  onTouched: () => void = () => {};
  disabled = false;
  // ── ControlValueAccessor ──────────────────────────────────────────────────

  writeValue(val: unknown): void {
    this.value = val ?? null;
  }

  registerOnChange(fn: (val: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelect(val: unknown): void {
    this.value = val;
    this.onChange(val); // notify FormControl of the new value
    this.onTouched();
  }
}
