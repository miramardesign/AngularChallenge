import { Injectable } from '@angular/core';
import { CalendarLayoutData, PersistenceData } from '../models/calender-models';

@Injectable({
  providedIn: 'root',
})
export class PersistenceServiceService {
  constructor() {}

  /**
   * depping to month
   * @param date
   * @returns
   */
  getDayKey(date: Date) {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
  }

  /**
   * keying by year-month and then inside is a day obj
   * @param date
   * @returns
   */
  getMonthKey(date: Date) {
    return date.getFullYear() + '-' + date.getMonth();
  }

  /**
   * keying by year-month and then inside is a day obj
   * @param date
   * @returns
   */
  getMonthKeyByLayoutData(layoutData: CalendarLayoutData) {
    return layoutData.year + '-' + layoutData.month;
  }

  saveToPersistence(key: string, value: PersistenceData.RootObject) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * gets from localstorage according to year-month key
   * @param yearMonthKey 
   * @returns 
   */
  async getFromPersistence(yearMonthKey: string): Promise<PersistenceData.RootObject> {
    let data = (await localStorage.getItem(yearMonthKey)) as string;
    if (!data) {
      data = '{}';
    }
    return JSON.parse(data);
  }
}
