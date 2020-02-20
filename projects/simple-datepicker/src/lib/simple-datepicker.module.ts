import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { SimpleSelectModule } from '@nutrify/ngx-simple-select';

import { DatepickerComponent } from './components/datepicker/datepicker.component';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    CommonModule,
    SimpleSelectModule,
    MatNativeDateModule
  ],
  exports: [DatepickerComponent, SimpleSelectModule]
})
export class SimpleDatepickerModule { }
