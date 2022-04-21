import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WeatherIconComponent } from './weather-icon.component';


@NgModule({
  declarations: [WeatherIconComponent],
  exports: [WeatherIconComponent],
  imports: [
    FormsModule,
    SharedModule,
    CommonModule,
  ]
})
export class WeatherIconModule { }
