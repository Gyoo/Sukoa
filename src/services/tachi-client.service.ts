import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Song} from "../model/Song";
import {Chart} from "../model/Chart";

@Injectable({
  providedIn: 'root'
})
export class TachiClientService {

  constructor(private http: HttpClient) { }

  getSongs(): Observable<Song[]>{
    return this.http.get<Song[]>("https://raw.githubusercontent.com/zkldi/Tachi/main/seeds/collections/songs-ddr.json");
  }

  getCharts(): Observable<Chart[]>{
    return this.http.get<Chart[]>("https://raw.githubusercontent.com/zkldi/Tachi/main/seeds/collections/charts-ddr.json");
  }
}
