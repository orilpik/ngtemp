import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiUrl = 'https://cors-anywhere.herokuapp.com/http://api.weathercloud.net/v01/set';
  private wid = '87d51ef7a98d705f'; // Tu WID
  private key = 'b6d58a78cdb2777484975802c342b9a5'; // Tu Key

  private apiUrlOpen = 'http://api.openweathermap.org/data/2.5/weather';
  private apiKey = '9f2eb16478214b60e04a98f6a881109b'; // sustituye esto por tu clave API


  constructor(private http: HttpClient) { }

  getWeather(): Observable<any> {
    return this.http.get(`${this.apiUrl}/wid/${this.wid}/key/${this.key}`);
  }

  getWeatherOpen(city: string): Observable<any> {
    return this.http.get(`${this.apiUrlOpen}?q=${city}&appid=${this.apiKey}&units=metric`);
  }
  getColor(){}
}
