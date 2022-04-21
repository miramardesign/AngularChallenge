import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import { ReminderFormModule } from '../reminder-form/reminder-form.module';
import { WeatherIconComponent } from '../weather-icon/weather-icon.component';
import { ReminderFormInlineComponent } from '../reminder-form-inline/reminder-form-inline.component';

@NgModule({
  declarations: [
    CalendarComponent,
    WeatherIconComponent,
   // ReminderFormInlineComponent,
    ReminderFormComponent,
  ],
  exports: [CalendarComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    SharedModule,

    ReminderFormModule,
  ],
  // entryComponents: [ReminderFormComponent],
})
export class CalendarModule { }
