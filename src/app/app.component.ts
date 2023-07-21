import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private baseWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
  private urlSuffix = '&units=metric&APPID=9f2eb16478214b60e04a98f6a881109b';

  city: string = 'Castelldans';
  weather!: string;
  temp!: number;

  lastUpdate!: string;

  private refreshInterval: any;
  timeRemaining: number = 600; // 10 minutos en segundos

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getWeather(this.city).subscribe(
      res => {
        this.weather = `${res['main'].temp.toFixed(1)}ºC`;
        this.temp = res.main.temp;
        this.lastUpdate = this.formatLastUpdate(res.dt);

        // Calcular el tiempo transcurrido desde la última actualización en segundos
        const now = Math.floor(Date.now() / 1000);
        const elapsed = now - res.dt;

        // Si han pasado menos de 600 segundos (10 minutos) desde la última actualización,
        // configurar timeRemaining a la diferencia. Si no, configurarlo a 0 para forzar una actualización inmediata.
        this.timeRemaining = elapsed < 600 ? 600 - elapsed : 0;

        this.startRefreshTimer();
      },
      err => console.log(`Can't get weather. Error code: %s, URL: %s`, err.message, err.url)
    );
  }
  ngOnDestroy() {
    this.stopRefreshTimer();
  }
  formatLastUpdate(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convertir el timestamp a milisegundos
  
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    };
  
    return date.toLocaleTimeString(undefined, options); // Formatear la hora en formato local sin los segundos
  }
  

  getWeather(city: string): Observable<any> {
    return this.http.get(this.baseWeatherURL + city + this.urlSuffix);
  }

  getColor(temp: number) {
    const hue = (1 - (temp + 40) / 70) * 240; // Calcula el valor del componente de matiz (hue) en función de la temperatura
    return `hsl(${hue}, 100%, 50%)`; // Retorna el color en formato HSL utilizando el matiz (hue) calculado
  }
  startRefreshTimer() {
    this.refreshInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.refreshPage();
        this.timeRemaining = 600; // Reiniciar el contador a 10 minutos cuando se realiza el refresco
      }
    }, 1000); // Actualizar cada segundo
  }

  stopRefreshTimer() {
    clearInterval(this.refreshInterval);
  }

  refreshPage() {
    location.reload();
  }
}
