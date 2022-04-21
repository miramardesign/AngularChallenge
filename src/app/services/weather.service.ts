import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from './calender-constants';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiKey: String;

  constructor(
    private http: HttpClient,
    private constantService: ConstantService
  ) {
    this.apiKey = this.constantService.API_KEY;
  }

  getWeatherInformation(city: string) {
    return {
      city,
      weatherInfo: 'here',
    };
  }

  getWeather(city: string, lat = '', lon = ''): Observable<any> {
    //  not a free api doesnt work
    //let weatherUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=16&appid=${this.apiKey}`

    //only gets 8 days,
    let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;

    //works with my key.  http://api.openweathermap.org/data/2.5/weather?q=London&appid=36546e1db8f2ce25a5cd956090793f91

    return this.http.get(weatherUrl).pipe();
  }


}
