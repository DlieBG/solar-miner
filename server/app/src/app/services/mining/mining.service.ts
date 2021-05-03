import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Current, Profit } from 'src/app/mining/mining.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MiningService {

  constructor(private httpClient: HttpClient) { }

  public getManual(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${environment.apiServer}mining/manual`);
  }

  public postManual(manual: boolean): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.apiServer}mining/manual`, { manual: manual });
  }

  public getStatus(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${environment.apiServer}mining/status`);
  }

  public postStatus(status: boolean): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.apiServer}mining/status`, { status: status });
  }

  public getShutdown(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${environment.apiServer}mining/shutdown`);
  }

  public postShutdown(shutdown: boolean): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.apiServer}mining/shutdown`, { shutdown: shutdown });
  }

  public getAddress(): Observable<string> {
    return this.httpClient.get<string>(`${environment.apiServer}mining/address`);
  }

  public getProfit(): Observable<Profit> {
    return this.httpClient.get<Profit>(`${environment.apiServer}mining/profit`);
  }

  public getCurrent(): Observable<Current> {
    return this.httpClient.get<Current>(`${environment.apiServer}mining/current`);
  }
}
