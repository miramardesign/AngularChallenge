import { Component, Input, OnInit } from '@angular/core';

import * as icons from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-weather-icon',
  templateUrl: './weather-icon.component.html',
  styleUrls: ['./weather-icon.component.scss'],
})
export class WeatherIconComponent implements OnInit {
  @Input() weather: string = '';

  icons = icons;

  constructor() {}

  ngOnInit(): void {}
}
