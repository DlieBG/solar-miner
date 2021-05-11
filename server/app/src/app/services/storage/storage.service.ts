import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Energy } from 'src/app/storage/storage.interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private httpClient: HttpClient) { }

  public getEnergy(): Observable<Energy> {
    return this.httpClient.get<Energy>(`${environment.apiServer}storage/energy`);
  }
}
