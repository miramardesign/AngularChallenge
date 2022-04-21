import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ReminderFormInlineModule } from '../reminder-form-inline/reminder-form-inline.module';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import { ReminderFormModule } from '../reminder-form/reminder-form.module';
import { WeatherIconModule } from '../weather-icon/weather-icon.module';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';




@NgModule({
  declarations: [
    CalendarComponent,

  ],
  exports: [CalendarComponent],
  imports: [
    CommonModule,
    FormsModule,

    CalendarRoutingModule,
    SharedModule,
    ReminderFormInlineModule,
    ReminderFormModule,
    WeatherIconModule,
  ],
  entryComponents: [ReminderFormComponent],
})
export class CalendarModule { }
