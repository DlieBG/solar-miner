import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public getProfit(): Observable<number> {
    return this.httpClient.get<number>(`${environment.apiServer}mining/profit`);
  }
}
