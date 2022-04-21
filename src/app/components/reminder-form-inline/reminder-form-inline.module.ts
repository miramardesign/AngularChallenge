import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderFormInlineComponent } from './reminder-form-inline.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WeatherIconModule } from '../weather-icon/weather-icon.module';


@NgModule({
  declarations: [ReminderFormInlineComponent],
  exports: [ReminderFormInlineComponent],
  imports: [
    FormsModule,
    SharedModule,
    CommonModule,
    WeatherIconModule,
  ]
})
export class ReminderFormInlineModule { }
