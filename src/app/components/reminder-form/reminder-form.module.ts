import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderFormComponent } from './reminder-form.component';
import { WeatherIconModule } from '../weather-icon/weather-icon.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
 declarations: [ReminderFormComponent],
 exports: [ReminderFormComponent],
  imports: [
    CommonModule, 
    SharedModule,

    FormsModule,
    WeatherIconModule,
  ]
})
export class ReminderFormModule { }
