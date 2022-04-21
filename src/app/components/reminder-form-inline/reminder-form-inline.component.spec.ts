import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CalendarViewDateType } from 'src/app/interfaces/calender-models';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WeatherIconModule } from '../weather-icon/weather-icon.module';

import { ReminderFormInlineComponent } from './reminder-form-inline.component';

describe('ReminderFormInlineComponent', () => {
  let component: ReminderFormInlineComponent;
  let fixture: ComponentFixture<ReminderFormInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        SharedModule,
        CommonModule,
        WeatherIconModule,
      ],

      declarations: [ ReminderFormInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderFormInlineComponent);
    component = fixture.componentInstance;

    component.formModeData = {
      dayToUpdate: -1,
      mode: 'create',
      evtI: 0,
    };

    component.formData = {
      desc: '1234567890  1234567890  1234567890  1234567890  1234567890  ',
      // desc: '1234567890  ',
      city: 'Roario',
      time: '9:00 a',
      weather: 'slight chance of apacolypse',
    };

    component.calendarLayoutDay = {
      day: 20,
      year: 2022,
      month: 3,
      dateType: CalendarViewDateType.Current,
      events: [],
      selected: true,
    };

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Unit test the functionality:
  // Ability to add "reminders" (max. 30 characters) for a day and time specified by the user. Also, include a city.

  it('should fail validation with a desc of more than 30 chars', () => {
    expect(component.isValidForm(component.formData)).toBeFalse();
  });

  it('should pass validation with a desc of lass than 30 chars', () => {
    component.formData.desc = 'smalldesctest';

    expect(component.isValidForm(component.formData)).toBeTrue();
  });

  it('should fail validation if city is empty', () => {
    component.formData.city = '';

    expect(component.isValidForm(component.formData)).toBeFalse();
  });


});
