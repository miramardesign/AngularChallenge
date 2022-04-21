import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CalendarComponent } from './calendar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ReminderFormInlineModule } from '../reminder-form-inline/reminder-form-inline.module';
import { ReminderFormModule } from '../reminder-form/reminder-form.module';
import { WeatherIconModule } from '../weather-icon/weather-icon.module';
import { CalendarRoutingModule } from './calendar-routing.module';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
   
        CommonModule,
        FormsModule,
    
        CalendarRoutingModule,
        SharedModule,
        ReminderFormInlineModule,
        ReminderFormModule,
        WeatherIconModule,
      ],
         
      declarations: [ CalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
