import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-p-input-text',
  standalone: true,
  imports: [InputTextModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PInputTextComponent),
      multi: true,
    },
  ],
  template: `
    <input
      pInputText
      type="text"
      [value]="value"
      [placeholder]="placeholder"
      (input)="onInput($event)"
      [style]="{ width: '100%' }" />
  `
})
export class PInputTextComponent implements ControlValueAccessor {
  @Input() value = '';
  @Input() placeholder = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
  onChange: (val: unknown) => void = () => {};
  onTouched: () => void = () => {};
  disabled = false;
  // ── ControlValueAccessor ──────────────────────────────────────────────────

  writeValue(val: unknown): void {
    this.value = val as string;
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
}
