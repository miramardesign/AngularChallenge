import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reminder } from 'src/app/interfaces/reminder';
import { CalendarEvent, FormModeData, CalendarLayoutData } from 'src/app/models/calender-models';
import { ConstantService } from 'src/app/services/calender-constants';
import * as validate from 'validate.js';
import { rangeFor } from '../../helpers/helper-fns';

@Component({
  selector: 'app-reminder-form-inline',
  templateUrl: './reminder-form-inline.component.html',
  styleUrls: ['./reminder-form-inline.component.scss']
})
export class ReminderFormInlineComponent implements OnInit {


//end theris

  validate = validate;
  @Input()
  formData!: CalendarEvent;
  @Input()
  formModeData!: FormModeData;

  @Input()
  calendarLayoutDay!: CalendarLayoutData;

  @Input()
  daysInMonth!: number;

  @Output() reminderFormSave = new EventEmitter<any>();
  @Output() reminderFormCancel = new EventEmitter<any>();

  calendarLayoutDayCopy!: CalendarLayoutData;

  formDataCopy!: CalendarEvent;

  formModeDataCopy!: FormModeData;

  availableTimesList: string[];

  range = rangeFor;
  isValid: any = false;

  constructor(private constantService: ConstantService) {
    this.availableTimesList = this.constantService.AVAILABLE_TIMES_LIST;
  }

  ngOnInit(): void {

    //needed deep copy.
    this.calendarLayoutDayCopy = { ...this.calendarLayoutDay, events:[...this.calendarLayoutDay.events] };

    this.formModeDataCopy = {... this.formModeDataCopy};

    if(this.formModeDataCopy.mode === 'create' ){
      this.formData = {
        desc: '',
        city: '',
        time: '',
        weather: '',
        
      }
    }

  }

  /**
   *
   * @param formData
   * @returns
   */
  isValidForm(formData: CalendarEvent) {
    let constraints = {
      desc: { length: { maximum: 30 } },

      city: {
        presence: true,
      },
    };

    let valRes = this.validate(formData, constraints);

    //the validate fn rets undefined if value
    if (valRes === undefined) {
      return true;
    } else {
      console.error('valres', valRes);
      return false;
    }
  }

  onSubmit(
    f: NgForm,
    layoutData: CalendarLayoutData,
    formData: CalendarEvent,
    formModeData: any
  ) {
    if (this.isValidForm(formData)) {
      let saveEventData: any = {
        layoutData: layoutData,
        formData: formData,
        formModeData: formModeData,
      };
      this.reminderFormSave.emit(saveEventData);
    } else {
      console.error('invalid error hit', f.errors, '  f.invalid', f.invalid);
    }
  }

  /**
   * cancel btn
   */
  cancelEvent() {
    this.reminderFormCancel.emit('cancel btn hit.');
  }



}
