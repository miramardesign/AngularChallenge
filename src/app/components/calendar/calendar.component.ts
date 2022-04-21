import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Reminder } from 'src/app/interfaces/reminder';
import { CalendarService } from 'src/app/services/calendar.service';
import { WeatherService } from 'src/app/services/weather.service';
import { MatDialog } from '@angular/material/dialog';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';

import * as moment from 'moment';

import {
  CalendarEvent,
  CalendarLayoutData,
  FormModeData,
  PersistenceData,
} from 'src/app/interfaces/calender-models';
import { kToF, rangeFor } from 'src/app/helpers/helper-fns';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject<boolean>();
 
  range = rangeFor;
  now: Date;

  location = {
    lat: 0,
    lon: 0,
  };

  persistenceData: PersistenceData.RootObject = {};


  currentMonth: string = '';
  currentDay: number = 0;
  currentFullYear: number = 0;
  daysInMonth: number = 31;

  currentCalenderMonthArray: CalendarLayoutData[] = [];

  formData: CalendarEvent = {
    desc: '',
    time: '-1',
    city: '',
    weather: '',
  };

  formModeData: FormModeData = {
    mode: 'create',
    evtI: -1, //for editing an id,
    dayToUpdate: -1,
  };

  dateSelections:
    | {
        selectedDayOfWeek: number | undefined;
        selectedWeekNum: number | undefined;
        indexSelected: number | undefined;
      }
    | undefined;

  hasSelection = false;

  constructor(
    private calendarService: CalendarService,
    private weatherService: WeatherService,
    private matDialog: MatDialog,
    private persistenceService: PersistenceService
  ) {
    this.now = new Date();
  }

  ngOnInit(): void {
    this.initCal(this.now);
    this.setLocation();

  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  async initCal(now: Date) {
    //make sure its clean
    this.currentCalenderMonthArray = [];

    this.currentMonth = moment(now).format('MMMM');

    this.currentDay = now.getDay();
    this.currentFullYear = now.getFullYear();

    this.daysInMonth = this.calendarService.getLastDayOfCurrentMonth(now);

    let monthKey = this.persistenceService.getMonthKey(now);
    this.persistenceData = await this.persistenceService.getFromPersistence(
      monthKey
    );

    this.currentCalenderMonthArray = this.calendarService.getCurrentCalenderMonthArray(
      now,
      this.persistenceData || []
    );
  }

  
  /**
   * depping to inline form, using for documentation UI for now.
   * @param reminder 
   */
   openReminderForm(reminder?: Reminder) {
    this.matDialog.open(ReminderFormComponent, {
      data: {
        reminder,
      },
    });
  }

 
  /**
   * change month to the previous
   * @param date the date to subtract
   */
  viewPrevMonth(date: Date) {
    this.now = moment(date).subtract(1, 'M').toDate();
    this.initCal(this.now);
    this.resetDateSelections();
  }

  /**
   * change month to the next
   * @param date the date to add
   */
  viewNextMonth(date: Date) {
    this.now = moment(date).add(1, 'M').toDate();
    this.initCal(this.now);
    this.resetDateSelections();
  }

  /**
   * use location api so i have a lat and long
   */
  setLocation() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    let parent = this;

    function success(pos: any) {
      var crd = pos.coords;

      parent.location = { lat: crd.latitude, lon: crd.longitude };
    }

    function error(err: any) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      //setting mock location.
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  /**
   * push weather data into scope so that its ready when the user adds a reminder
   * @param daysOut
   * @param location
   */
  setWeatherData(daysOut: number, location: any) {
    //free api only has 7 days, so just mocking how many days out.
    if (daysOut > 7) {
      daysOut = daysOut % 7;
    }

    this.weatherService
      .getWeather('Rosario', location.lat, location.lon)
      .subscribe((data) => {
        let weatherCond = data.daily[daysOut].weather[0];
        let tempCondMaxK = data.daily[daysOut].temp.max;
        let tempF = kToF(tempCondMaxK);

        this.formData.weather = `${tempF}°F ${weatherCond.description}`;
      });
  }

  /**
   * gets the form ready to edit the event.
   * @param layoutData the data of the day
   * @param dayNumber day clicked on
   * @param location their location api data.
   * @returns
   */
  addEvent(layoutData: CalendarLayoutData, dayNumber: number, location: any) {
    //this.deselectAllDays();

    //if they click on extra days on end of month.
    if (layoutData.dateType !== 'current') {
      return;
    }
    // this.resetFormData();
    this.resetDateSelections();

    let todayDay = moment(new Date()).startOf('day');
    let eventDay = moment(
      new Date(
        layoutData.year as number,
        layoutData.month as number,
        layoutData.day
      )
    ).startOf('day');

    let daysAhead = eventDay.diff(todayDay, 'day');

    this.setWeatherData(daysAhead, location);

    layoutData.selected = true;

    this.dateSelections = {
      selectedDayOfWeek: dayNumber % 7,
      selectedWeekNum: Math.floor(dayNumber / 7),
      indexSelected: dayNumber,
    };
  }

  /**
   * this clears the enlarged day in the calender
   * by changing the css classes in ngClass
   */
  resetDateSelections() {
    this.dateSelections = {
      selectedDayOfWeek: undefined,
      selectedWeekNum: undefined,
      indexSelected: undefined,
    };
  }

  resetFormData() {
    this.formData = {
      desc: '',
      time: '-1',
      city: '',
      weather: '',
    };

    this.formModeData = {
      mode: 'create',
      evtI: -1, //the idx for editing an exsiting,

      //for changing a day of an existing event.
      dayToUpdate: -1,
    };
  }

  /**
   * main save to layout ui and to persistence from form,
   * @param data emitted data from form  { layoutData, formData, formModeData }
   */
  async saveEvent(data: any, calendarLayoutDayOriginal: any) {

    this.calendarService.saveEvent(data, calendarLayoutDayOriginal, this.persistenceData);

    this.resetDateSelections();

    //it gets confused when editing dates, refresh
    this.initCal(this.now);
  }

  /**
   * clicked on trash icon
   * @param evtI index of the event to delete
   * @param calendarLayoutDay day object to affect
   */
  async rmEvent(
    day: number,
    evtI: number,
    layoutData: CalendarLayoutData,
    persistenceData: any
  ) {
   
    this.calendarService.rmEvent(day, evtI, layoutData, persistenceData);
    //cleanup
    this.resetDateSelections();
  }

  /**
   * clicked on edit icon, just pushes into editor and sets up editing from there.
   * by setting formModeData
   * @param evtI
   * @param calendarLayoutDay
   */
  editEvent(evtI: number, layoutData: CalendarLayoutData) {
    console.log('todo edit event iwth id', evtI, layoutData);

    this.formModeData = {
      mode: 'edit',
      evtI: evtI, //for editing an id,
      dayToUpdate: -1,
    };

    this.formData = layoutData.events[evtI];
  }

  /**
   * cancel btn
   */
  cancelEvent() {
    this.resetDateSelections();
  }
}
