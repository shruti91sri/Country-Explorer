import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);   // notify FormControl of the new value
    this.onTouched(); 
  }
  onChange: (val: unknown) => void = () => {};
  onTouched: () => void = () => {};
  disabled = false;
  // ControlValueAccessor implementation

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
