import { NgModule } from '@angular/core';
import { SimpleSelectModule } from '@nutrify/ngx-simple-select';

import { DatepickerComponent } from './components/datepicker/datepicker.component';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    SimpleSelectModule
  ],
  exports: [DatepickerComponent]
})
export class SimpleDatepickerModule { }
