import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Game } from "./models/game";
import { catchError } from "rxjs/operators";
import { Machine } from "./models/machine";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private readonly http: HttpClient) { }


  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>('/api/v1/machine')
  }

  save(machine: Machine){
    return this.http.post('/api/v1/machine', machine)
  }

  // getGame(gameId: number): Observable<Game> {
  //   return this.http.get<Game>(`/api/v1/game/${gameId}`).pipe(catchError(this.handleError('getGame', new Game)));
  // }
  getMachine(machineId: number) {
    return this.http.get<Machine>(`/api/v1/machine/${machineId}`);
  }
}
