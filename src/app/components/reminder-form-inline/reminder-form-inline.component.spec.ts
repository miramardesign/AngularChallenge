import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderFormInlineComponent } from './reminder-form-inline.component';

describe('ReminderFormComponent', () => {
  let component: ReminderFormInlineComponent;
  let fixture: ComponentFixture<ReminderFormInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderFormInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderFormInlineComponent);
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
