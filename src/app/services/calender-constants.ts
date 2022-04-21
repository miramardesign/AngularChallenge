import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantService {
  API_KEY: String;

  //move to constants.
  AVAILABLE_TIMES_LIST = [
    '9:00 a',
    '9:30 a',
    '10:00 a',
    '10:30 a',
    '11:00 a',
    '11:30 a',
    '12:00 p',
    '12:30 p',
    '1:00 p',
    '1:30 p',
    '2:00 p',
    '2:30 p',
    '3:00 p',
    '3:30 p',
    '4:00 p',
    '4:30 p',
    '5:00 p',
  ];

  ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERS_AND_EVERYTHING = 42;

  constructor() {
    this.API_KEY = '36546e1db8f2ce25a5cd956090793f91';
  }
}
