import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { Reminder } from '../interfaces/reminder';
import { CalendarLayoutData, CalendarViewDateType } from '../interfaces/calender-models';
import { ConstantService } from './calender-constants';
import { PersistenceService } from './persistence.service';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  reminders: Reminder[] = [];

  constructor(private constantService: ConstantService,
    private persistenceService: PersistenceService) { }

  create(data: Reminder): Reminder {
    return data;
  }

  edit(data: Reminder): Reminder {
    return data;
  }

  list(date: Date): Observable<Reminder[]> {
    console.log(date);
    return of(this.reminders);
  }

  delete(reminderId: string): boolean {
    console.log(reminderId);
    return true;
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
          events: persistenceData[keyI]?.events || [],
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
   * main save to layout ui and to persistence from form,
   * @param data emitted data from form  { layoutData, formData, formModeData }
   */
  async saveEvent(data: any, calendarLayoutDayOriginal: any, persistenceData: any) {
    let { layoutData, formData, formModeData, } = data;


    //if editing change a specific index with the form data
    if (formModeData.mode === 'edit') {
      //if they updated the day in the droppy down.
      if (formModeData.dayToUpdate !== -1) {
        //write new one
        layoutData.day = formModeData.dayToUpdate;

        //remove old event.
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

 
  }
  

}
