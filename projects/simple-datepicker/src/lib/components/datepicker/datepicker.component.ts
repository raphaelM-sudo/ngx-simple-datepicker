import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'simple-datepicker',
  exportAs: 'simpleDatepicker',
  templateUrl: './datepicker.component.html',
  styles: [],
  // tslint:disable-next-line: use-host-property-decorator
  host: {
    class: 'simple-datepicker',
  }
})
export class DatepickerComponent implements OnInit, ControlValueAccessor {

  @Input() startingYear = new Date().getFullYear() - 115;
  @Input() endingYear = new Date().getFullYear() - 16;
  @Input() months: string[] = [
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

  get date() {
    if (this.selectedDay && this.selectedMonth && this.selectedYear) {
      return { day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear };
    } else {
      return null;
    }
  }

  numberOfDays = 31;
  selectedYear: number = null;
  selectedMonth: number = null;
  selectedDay: number = null;

  daysInMonth(month: number, year: number = 0) {

    switch (month) {
      case 2:
        const isLeapYear: boolean = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        if (isLeapYear) {
          this.numberOfDays = 29;
        } else {
          this.numberOfDays = 28;
        }
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

  updateDays() {
    this.numberOfDays = this.daysInMonth(this.selectedMonth, this.selectedYear);
  }

  writeValue(obj: any) {

  }

  registerOnChange(fn: any) {

  }

  registerOnTouched(fn: any) {

  }

  setDisabledState?(isDisabled: boolean) {

  }

  constructor() {
  }

  ngOnInit() {
  }

}
