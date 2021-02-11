import { Subscription } from 'rxjs';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Input, OnDestroy, Optional,
    Self, ViewEncapsulation
} from '@angular/core';
import {
    AbstractControl, ControlValueAccessor, FormGroupDirective, NgControl, NgForm, ValidationErrors,
    Validator, ValidatorFn, Validators
} from '@angular/forms';
import {
    CanDisable, CanDisableCtor, CanUpdateErrorState, CanUpdateErrorStateCtor, DateAdapter,
    ErrorStateMatcher, mixinDisabled, mixinErrorState
} from '@angular/material/core';

import { Months } from '../../models/months.model';

let nextUniqueId = 0;

class SimpleDatepickerBase {
  constructor(public _defaultErrorStateMatcher: ErrorStateMatcher,
              public _parentForm: NgForm,
              public _parentFormGroup: FormGroupDirective,
              public ngControl: NgControl) {}
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _SimpleDatepickerMixinBase:
  CanDisableCtor &
  CanUpdateErrorStateCtor &
  typeof SimpleDatepickerBase = mixinDisabled(mixinErrorState(SimpleDatepickerBase));

@Component({
  selector: 'simple-datepicker',
  exportAs: 'simpleDatepicker',
  templateUrl: './datepicker.component.html',
  inputs: ['disabled'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line
  host: {
    '[attr.id]': 'id',
    class: 'simple-datepicker',
    '[attr.min]': 'min ? dateAdapter.toIso8601(min) : null',
    '[attr.max]': 'max ? dateAdapter.toIso8601(max) : null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-required]': 'required.toString()',
    '[class.simple-datepicker-disabled]': 'disabled',
    '[class.simple-datepicker-invalid]': 'validationError'
  }
})
export class DatepickerComponent extends _SimpleDatepickerMixinBase
implements CanDisable, ControlValueAccessor, CanUpdateErrorState, DoCheck, Validator, OnDestroy {

  @Input() dayPlaceholder = 'Day';
  @Input() monthPlaceholder = 'Month';
  @Input() yearPlaceholder = 'Year';
  @Input() months: Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  @Input()
  get id(): string { return this._id; }
  set id(id: string) {
    this._id = id || this.uid;
  }

  @Input()
  get value(): Date { return this._value; }
  set value(value: Date) {
    this._value = this.coerceDateProperty(value);
  }

  @Input()
  get required(): boolean { return this._required; }
  set required(required: boolean) {
    this._required = coerceBooleanProperty(required);
  }

  @Input()
  get min(): Date { return this._min; }
  set min(min: Date) {
    this._min = this.coerceDateProperty(this.dateAdapter.deserialize(min));
    this.validatorOnChange();
  }

  @Input()
  get max(): Date { return this._max; }
  set max(max: Date) {
    this._max = this.coerceDateProperty(this.dateAdapter.deserialize(max));
    this.validatorOnChange();
  }

  get errorState(): boolean {
    return this._errorState;
  }

  set errorState(errorState: boolean) {
    this._errorState = errorState;
  }

  get selectedDay(): number {
    if (!this._selectedDay && this.previousDay <= this.numberOfDays) {
      this._selectedDay = this.previousDay;
    }
    return this._selectedDay;
  }

  set selectedDay(selectedDay: number) {
    this._selectedDay = selectedDay;
  }

  get startingYear(): number {
    return this.min ? this.min.getFullYear() : new Date().getFullYear() - 115;
  }

  get endingYear(): number {
    return this.max ? this.max.getFullYear() : new Date().getFullYear() - 16;
  }

  numberOfDays = 31;
  selectedYear: number = null;
  selectedMonth: number = null;

  validationError = false;

  private _id: string;
  private _value = null;
  private _required = false;
  private _errorState = false;
  private _min: Date;
  private _max: Date ;
  private _selectedDay: number = null;
  private previousDay: number = null;

  private localeSubscription = Subscription.EMPTY;

  private uid = `simple-datepicker-${++nextUniqueId}`;

  private validators = new Map([
    ['simpleDatepickerMin',
      (control: AbstractControl): ValidationErrors => {
        const controlValue = this.coerceDateProperty(this.dateAdapter.deserialize(control.value));
        return (!this.min || !controlValue ||
            this.dateAdapter.compareDate(this.min, controlValue) <= 0) ?
            null : {simpleDatepickerMin: {min: this.min, actual: controlValue}};
      }
    ],
    ['simpleDatepickerMax',
      (control: AbstractControl): ValidationErrors => {
        const controlValue = this.coerceDateProperty(this.dateAdapter.deserialize(control.value));
        return (!this.max || !controlValue ||
            this.dateAdapter.compareDate(this.max, controlValue) >= 0) ?
            null : {simpleDatepickerMax: {max: this.max, actual: controlValue}};
      }
    ]
  ]);

  constructor(
    private cdRef: ChangeDetectorRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    @Self() @Optional() public ngControl: NgControl,
    @Optional() public dateAdapter: DateAdapter<Date>) {

    super(_defaultErrorStateMatcher, _parentForm,
          _parentFormGroup, ngControl);

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
      this.ngControl.control.setValidators(this.validator);
      this.ngControl.control.updateValueAndValidity();
    }

    // Force setter to be called in case id was not specified.
    this.id = this.id;

    // Update the displayed date when the locale changes.
    this.localeSubscription = dateAdapter.localeChanges.subscribe(() => {
      this.value = this.value;
    });
  }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  private validatorOnChange = () => {};

  /* eslint-disable @typescript-eslint/member-ordering */
  /** The form control validator for the min date. */
  private minValidator: ValidatorFn = this.validators.get('simpleDatepickerMin');

  /** The form control validator for the max date. */
  private maxValidator: ValidatorFn = this.validators.get('simpleDatepickerMax');

  private validator: ValidatorFn =
  Validators.compose([this.minValidator, this.maxValidator]);

  private coerceDateProperty(obj: any): Date {
    return (this.dateAdapter.isDateInstance(obj) && this.dateAdapter.isValid(obj)) ? obj : null;
  }

  daysInMonth(month: number, year: number = 0) {

    switch (month) {
      case 2:
        const isLeapYear: boolean = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        this.numberOfDays = isLeapYear ? 29 : 28;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        this.numberOfDays = 30;
        break;
      default:
        this.numberOfDays = 31;
    }

    return this.numberOfDays;
  }

  updateDay(day: number) {
    this.selectedDay = day;
    if (day) {
      this.previousDay = day;
    }
    this.propagateTouched();
    this.emit();
  }

  update() {
    this.numberOfDays = this.daysInMonth(this.selectedMonth, this.selectedYear);
    this.propagateTouched();
    this.cdRef.detectChanges();
    this.emit();
  }

  emit() {
    if (this.selectedDay !== null && this.selectedMonth !== null && this.selectedYear !== null) {
      if (this.coerceDateProperty(this.value)) {
        this.value.setDate(this.selectedDay);
        this.value.setMonth(this.selectedMonth - 1);
        this.value.setFullYear(this.selectedYear);
      } else {
        this.value = new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay);
      }
    } else {
      this.value = null;
    }

    this.propagateChange(this.value);
  }

  validate(c: AbstractControl): ValidationErrors {
    return this.validator ? this.validator(c) : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorOnChange = fn;
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();

      if (this.ngControl.errors && !this.ngControl.errors.required) {
        this.validationError = true;
      } else {
        this.validationError = false;
      }
    }
  }

  writeValue(value: Date) {
    if (this.coerceDateProperty(value)) {
      this.value = value;
      this.selectedDay = value.getDate();
      this.selectedMonth = value.getMonth();
      this.selectedYear = value.getFullYear();

      this.cdRef.detectChanges();
    }
  }

  registerOnChange(fn: () => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnDestroy() {
    this.localeSubscription.unsubscribe();
    this.stateChanges.complete();
  }
}
