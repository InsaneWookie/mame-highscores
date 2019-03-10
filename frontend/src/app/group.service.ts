import { Injectable } from '@angular/core';
import { Machine } from "./models/machine";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Group } from "./models/group";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private readonly http: HttpClient) { }


  getGroup(): Observable<Group> {
    return this.http.get<Group>('/api/v1/group')
  }
}
