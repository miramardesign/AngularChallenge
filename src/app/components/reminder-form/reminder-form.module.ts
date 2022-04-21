import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderFormComponent } from './reminder-form.component';
import { WeatherIconModule } from '../weather-icon/weather-icon.module';
import { FormsModule } from '@angular/forms';


@NgModule({
 declarations: [ReminderFormComponent],
 exports: [ReminderFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    WeatherIconModule,
  ]
})
export class ReminderFormModule { }
