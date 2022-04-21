import { Component, OnDestroy, OnInit } from '@angular/core';
import {  Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Reminder } from 'src/app/interfaces/reminder';
import { CalendarService } from 'src/app/services/calendar.service';
import { WeatherService } from 'src/app/services/weather.service';
import { MatDialog } from '@angular/material/dialog';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';

//mine
import * as moment from 'moment';

import { CalendarEvent, CalendarLayoutData, CalendarViewDateType, FormModeData, PersistenceData } from 'src/app/models/calender-models';
import { kToF, rangeFor } from 'src/app/helpers/helper-fns';
import { ConstantService } from 'src/app/services/calender-constants';
import { PersistenceServiceService } from 'src/app/services/persistence-service.service';
import * as icons from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  onDestroy$ = new Subject<boolean>();

  constructor(
    private calendarService: CalendarService,

    //todo marry
    private weatherService: WeatherService,

    private matDialog: MatDialog,
    private persistenceService: PersistenceServiceService,
    private constantService: ConstantService
  )  {
    this.now = new Date();
    this.availableTimesList = this.constantService.AVAILABLE_TIMES_LIST;
  }

  ngOnInit(): void {

    this.initCal(this.now);
    this.setLocation();

    //theirs
    // this.calendarService.list(new Date())
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe((reminders: Reminder[]) => {
    //     reminders.map((reminder: Reminder) => {
    //       return {
    //         ...reminder,
    //         weather: this.getWeather(reminder.city),
    //       };
    //     });
    //     console.log(reminders);
    //   });
  }

  getWeather(city: string) {
    const x = this.weatherService.getWeatherInformation(city);
    console.log(x);
    return x;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  openReminderForm(reminder?: Reminder) {
    this.matDialog.open(ReminderFormComponent, {
      data: {
        reminder,
      },
    });
  }
  //end theres.

  range = rangeFor;
  now: Date;
  icons = icons;

  location = {
    lat: 0,
    lon: 0,
  };

  persistenceData: PersistenceData.RootObject = {};

  availableTimesList: string[];

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

  dialogResult = '';
  dialogContainerRef: any;
  hasSelection = false;


  async initCal(now: Date) {
    //make sure its clean
    this.currentCalenderMonthArray = [];

    this.currentMonth = moment(now).format('MMMM');

    this.currentDay = now.getDay();
    this.currentFullYear = now.getFullYear();

    this.daysInMonth = this.getLastDayOfCurrentMonth(now);

    let monthKey = this.persistenceService.getMonthKey(now);
    this.persistenceData = await this.persistenceService.getFromPersistence(
      monthKey
    );

    this.currentCalenderMonthArray = this.getCurrentCalenderMonthArray(
      now,
      this.persistenceData || []
    );


  }

  /**
   * gets day of week of first day of month so it can be padded
   * is 0 BASED
   * 0 = sunday
   * @param date
   * @returns
   */
  getDayOfWeekOfFirstDay(date: Date) {
    return moment(date).startOf('month').toDate().getDay();
  }

  /**
   * gets number of days in month
   * is 1 BASED
   */
  getLastDayOfLastMonth(date: Date) {
    return moment(date).startOf('month').subtract(1, 'd').toDate().getDate();
  }

  getLastDayOfCurrentMonth(date: Date) {
    return moment(date).endOf('month').toDate().getDate();
  }

  /**
   * pass in a date and get a data representation
   * starting on sunday like a calendar would display, including
   * before start of current month and after as well
   * so its easy to do a repeat and show the month in the ui.
   * [29, 31, 1, 2, -- 30, 1, 2]
   * @param dateToMakeArr
   */
  getCurrentCalenderMonthArray(
    dateToMakeArr: Date,
    persistenceData: any
  ): CalendarLayoutData[] {

    let lastDayOfLastMonth = this.getLastDayOfLastMonth(dateToMakeArr);

    let lastDayOfCurrentMonth = this.getLastDayOfCurrentMonth(dateToMakeArr);


    let currentCalenderLayoutData: CalendarLayoutData[] = [];

    let firstSunday = moment(dateToMakeArr)
      .startOf('month')
      .startOf('week')
      .toDate()
      .getDate();

    //pre month, skip if month starts on sunday!
    if (firstSunday !== 1) {
      for (let preI = firstSunday; preI <= lastDayOfLastMonth; preI++) {
        currentCalenderLayoutData.push({
          day: preI,

          //not needed since not clickable
          dateType: CalendarViewDateType.Pre,
          events: [],
        });
      }
    }

    //this month
    for (let curI = 1; curI <= lastDayOfCurrentMonth; curI++) {
      //only current is clickable

      let keyI = 'day-' + curI.toString();

      const today = moment(new Date()).toDate().getDate();
      let dateTypeLocal;

      const nowDate = new Date();
      let isCurrMonth = moment(nowDate).isSame(dateToMakeArr, 'month');

      if (isCurrMonth) {
        //current month all days before today are uneditable(can set a reminder in the past?)
        dateTypeLocal =
          curI < today
            ? CalendarViewDateType.CurrentMonthButPast
            : CalendarViewDateType.Current;
      } else if (moment(dateToMakeArr).isAfter(nowDate)) {
        //future month
        dateTypeLocal = CalendarViewDateType.Current;
      } else {
        //past month, mark as past
        dateTypeLocal = CalendarViewDateType.Pre;
      }

      currentCalenderLayoutData.push({
        day: curI,
        year: dateToMakeArr.getFullYear(),
        month: dateToMakeArr.getMonth(),
        dateType: dateTypeLocal,
        events:  persistenceData[keyI]?.events || [],
      });
    }

    //ms calender just has 42 days always, it avoids shifting layout.
    //if we dont want that we could check for 35 and truncate there.
    const padEndLen =
      this.constantService
        .ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERS_AND_EVERYTHING -
      currentCalenderLayoutData.length;

    //next month padding
    for (let postI = 1; postI <= padEndLen; postI++) {
      currentCalenderLayoutData.push({
        day: postI,

        dateType: CalendarViewDateType.Post,
        events: [],
      });
    }

    return currentCalenderLayoutData;
  }

  /**
   * change month to the previous
   * @param date the date to subtract
   */
  prevMonth(date: Date) {
    this.now = moment(date).subtract(1, 'M').toDate();
    this.initCal(this.now);
    this.resetDateSelections();
  }

  /**
   * change month to the next
   * @param date the date to add
   */
  nextMonth(date: Date) {
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
   *
   * @param layoutData
   * @param i
   * @param location
   * @returns
   */

  addEvent(layoutData: CalendarLayoutData, i: number, location: any) {
    this.deselectAllDays();

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
      selectedDayOfWeek: i % 7,
      selectedWeekNum: Math.floor(i / 7),
      indexSelected: i,
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

  deselectAllDays() {
    // this.currentCalenderMonthArray.forEach((item) => {
    //   item.selected = false;
    // });
  }

  /**
   * main save to layout ui and to persistence from form,
   * @param data emitted data from form  { layoutData, formData, formModeData }
   */
  async saveEvent(data: any, calendarLayoutDayOriginal: any) {
    this.deselectAllDays();
    let { layoutData, formData, formModeData } = data;
    const persistenceData: any = this.persistenceData;
    
    console.log(' persistenceData ', persistenceData);


    //if editing change a specific index with the form data
    if (formModeData.mode === 'edit') {
      //if they updated the day in the droppy down.
      if (formModeData.dayToUpdate !== -1) {

        //write new one
        layoutData.day = formModeData.dayToUpdate;
       
        //remove old event.
        console.log(layoutData.events, '-----')
          // remove old event.
          await this.rmEvent(
            calendarLayoutDayOriginal.day,
            formModeData.evtI,
            calendarLayoutDayOriginal,
            persistenceData            
          );

      } else {
        //change values without updating..
        layoutData.events[formModeData.evtI] = formData;
      }
    } else {
      //push new data into the events obj so it shows in UI
      layoutData.events.push(formData);
    }

    //setup the key to save it as "day-5" inside the localStorage
    let monthKey = await this.persistenceService.getMonthKeyByLayoutData(
      layoutData
    );
    let dayKey: any = 'day-' + layoutData.day;

    //check if existing
    if (!persistenceData[dayKey]) {
      persistenceData[dayKey] = {};
    }

    persistenceData[dayKey].events = layoutData.events;

    //save to localStorage3
    await this.persistenceService.saveToPersistence(monthKey, persistenceData);

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
    let layoutDataCopy = { ...layoutData };
    let persistenceDataCopy = { ...persistenceData };

    console.info('removing event with id', evtI, layoutDataCopy);

    //setup the key to save it as "day-5" inside the localStorage
    let monthKey =
      this.persistenceService.getMonthKeyByLayoutData(layoutDataCopy);
    let dayKey: string = 'day-' + day;

    persistenceDataCopy[dayKey].events.splice(evtI, 1);
    //save to localStorage
    await this.persistenceService.saveToPersistence(
      monthKey,
      persistenceDataCopy
    );

    //update in UI;
    layoutData.events = persistenceData[dayKey].events;
    //should exist since edit.

    //cleanup
    this.resetDateSelections();
  }

  /**
   * clicked on edit icon, just pushes into editor and sets up editing from there.
   * by setting formModeData
   * @param evtI
   * @param calendarLayoutDay
   */
  editEvent(
    evtI: number,
    layoutData: CalendarLayoutData
  ) {
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
