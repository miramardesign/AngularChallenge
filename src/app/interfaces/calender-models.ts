export enum CalendarViewDateType {
  Pre = 'pre',
  Current = 'current',
  CurrentMonthButPast = 'currentpast',
  Post = 'post',
}
export interface CalendarEvent {
  desc: string;
  time: string | null;
  city: string;
  weather: string;
}

export interface CalendarLayoutData {
  day: number;
  id?: string;

  //not needed since not clickable
  year?: number;
  month?: number;
  dateType: CalendarViewDateType;
  events: CalendarEvent[];
  selected?: boolean;
}

export interface Notification {
  title: string;
  message?: string;
}

export interface FormModeData {
  mode: string;
  evtI: number;
  dayToUpdate: number;
}

export module PersistenceData {
  export interface Day1 {
    events: CalendarEvent[];
  }
  export interface Day2 {
    events: CalendarEvent[];
  }
  export interface Day3 {
    events: CalendarEvent[];
  }
  export interface Day4 {
    events: CalendarEvent[];
  }
  export interface Day5 {
    events: CalendarEvent[];
  }
  export interface Day6 {
    events: CalendarEvent[];
  }
  export interface Day7 {
    events: CalendarEvent[];
  }
  export interface Day8 {
    events: CalendarEvent[];
  }
  export interface Day9 {
    events: CalendarEvent[];
  }
  export interface Day10 {
    events: CalendarEvent[];
  }
  export interface Day11 {
    events: CalendarEvent[];
  }
  export interface Day12 {
    events: CalendarEvent[];
  }
  export interface Day13 {
    events: CalendarEvent[];
  }
  export interface Day14 {
    events: CalendarEvent[];
  }
  export interface Day15 {
    events: CalendarEvent[];
  }
  export interface Day16 {
    events: CalendarEvent[];
  }
  export interface Day17 {
    events: CalendarEvent[];
  }
  export interface Day18 {
    events: CalendarEvent[];
  }
  export interface Day10 {
    events: CalendarEvent[];
  }
  export interface Day19 {
    events: CalendarEvent[];
  }
  export interface Day20 {
    events: CalendarEvent[];
  }
  export interface Day21 {
    events: CalendarEvent[];
  }
    export interface Day22 {
    events: CalendarEvent[];
  }
  export interface Day23 {
    events: CalendarEvent[];
  }
  
  export interface Day24 {
    events: CalendarEvent[];
  }
  export interface Day25 {
    events: CalendarEvent[];
  }
  
  export interface Day26 {
    events: CalendarEvent[];
  }
  export interface Day27 {
    events: CalendarEvent[];
  }
  
  export interface Day28 {
    events: CalendarEvent[];
  }
  export interface Day29 {
    events: CalendarEvent[];
  }
  
  export interface Day30 {
    events: CalendarEvent[];
  }
  export interface Day31 {
    events: CalendarEvent[];
  }

  // "attr-lowercase": ["*ngIf", "*ngFor"]
  export interface RootObject {
    'day-1'?: Day1;
    'day-2'?: Day2;
    'day-3'?: Day3;
    'day-4'?: Day4;
    'day-5'?: Day5;
    'day-6'?: Day6;
    'day-7'?: Day7;
    'day-8'?: Day8;
    'day-9'?: Day9;
    'day-10'?: Day10;
    'day-11'?: Day11;
    'day-12'?: Day12;
    'day-13'?: Day13;
    'day-14'?: Day14;
    'day-15'?: Day15;
    'day-16'?: Day16;
    'day-17'?: Day17;
    'day-18'?: Day18;
    'day-19'?: Day19;
    'day-20'?: Day20;
    'day-21'?: Day21;
    'day-22'?: Day22;
    'day-23'?: Day23;
    'day-24'?: Day24;
    'day-25'?: Day25;
    'day-26'?: Day26;
    'day-27'?: Day27;
    'day-28'?: Day28;
    'day-29'?: Day29;
    'day-30'?: Day30;
    'day-31'?: Day31;
  }
}
