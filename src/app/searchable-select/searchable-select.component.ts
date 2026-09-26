import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserAccount } from '../models';

@Component({
  selector: 'app-searchable-select',
  template: `
    <p-dropdown
      [options]="options"
      [(ngModel)]="selectedOption"
      [ngModelOptions]="{ standalone: true }"
      [placeholder]="placeholder"
      [filter]="true"
      [filterBy]="'fullName'"
      [showClear]="true"
      [style]="{ width: '100%' }"
      [styleClass]="'custom-dropdown'"
      (onChange)="onSelect($event)"
      optionLabel="fullName"
      [disabled]="disabled">
      <ng-template let-student pTemplate="item">
        <div class="student-option">
          <div class="student-name marathi">{{ student.fullName }}</div>
          <div class="student-meta">{{ student.username }} • {{ student.email || student.phone || '' }}</div>
        </div>
      </ng-template>
      <ng-template let-student pTemplate="selectedItem">
        <div class="selected-student marathi">{{ student.fullName }} ({{ student.username }})</div>
      </ng-template>
    </p-dropdown>
  `,
  styles: [`
    :host ::ng-deep .custom-dropdown .p-dropdown {
      width: 100%;
    }
    :host ::ng-deep .custom-dropdown .p-dropdown-label {
      padding: 5px 5px;
      font-size: 14px;
    }
    :host ::ng-deep .custom-dropdown .p-dropdown-trigger {
      width: 40px;
    }
    :host ::ng-deep .custom-dropdown .p-dropdown-panel {
      border: 1px solid #d1d8e0;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    :host ::ng-deep .custom-dropdown .p-dropdown-item {
      padding: 5px 5px;
      border: none;
    }
    :host ::ng-deep .custom-dropdown .p-dropdown-item.p-highlight {
      background: #e8f4fd;
      color: #2980b9;
    }
    :host ::ng-deep .custom-dropdown .p-dropdown-item:hover {
      background: #f5f7fa;
    }
    :host ::ng-deep .custom-dropdown {
      border-radius: 12px;
    }
    :host ::ng-deep .custom-dropdown .p-dropdown-filter {
      padding: 5px 5px;
      border: none;
      border-bottom: 1px solid #eee;
      border-radius: 0;
      box-shadow: none;
    }
    :host ::ng-deep .custom-dropdown .p-dropdown-filter:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
    }
    .student-option {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .student-name {
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
    }
    .student-meta {
      font-size: 12px;
      color: #7f8c8d;
    }
    .selected-student {
      font-size: 14px;
      color: #2c3e50;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ]
})
export class SearchableSelectComponent implements ControlValueAccessor {
  @Input() options: UserAccount[] = [];
  @Input() placeholder = 'Select student...';
  @Input() disabled = false;
  @Output() selectedValueChange = new EventEmitter<UserAccount>();

  selectedOption: UserAccount | null = null;

  private onChange = (value: UserAccount | null) => {};
  private onTouched = () => {};

  onSelect(event: { value: UserAccount }) {
    this.selectedOption = event.value;
    this.onChange(event.value);
    this.markTouched();
    this.selectedValueChange.emit(event.value);
  }

  writeValue(value: UserAccount | null): void {
    if (value) {
      this.selectedOption = this.options.find(o => o.id === value.id) || null;
    } else {
      this.selectedOption = null;
    }
  }

  registerOnChange(fn: (value: UserAccount | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private markTouched() {
    this.onTouched();
  }
}