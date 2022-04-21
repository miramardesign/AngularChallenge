import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderFormComponent } from './reminder-form-inline.component';

describe('ReminderFormComponent', () => {
  let component: ReminderFormComponent;
  let fixture: ComponentFixture<ReminderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderFormComponent);
    component = fixture.componentInstance;
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
