import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Game } from "./models/game";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class GameService {

  constructor(private http: HttpClient) { }

  getGames() : Observable<Game[]> {
    return this.http.get<Game[]>('/api/v1/game?where={"has_mapping": true, "clone_of":null}&limit=500&sort=full_name ASC')
      .pipe(
      catchError(this.handleError('getGames', []))
    )
    // return [
    //   {
    //     id: 1, clone_of: null, full_name: "Donkey Kong", name: "Donkey Kong",
    //     scores: [{ name: "ABC", score: 123 }]
    //   }
    //
    // ];
  }

  getGames2() : Observable<Game[]> {
    return this.http.get<Game[]>(
      '/api/v1/game?limit=500&sort=full_name ASC&populate=[]&where={"has_mapping":true,"clone_of":null}'
    ).pipe(catchError(this.handleError('getGames2', [])));
  }

  getTopPlayers() : Observable<Game[]> {
    return this.http.get<Game[]>(
      '/api/v1/game/top_players'
    ).pipe(catchError(this.handleError('getTopPlayers', [])));
  }

  getLastPlayed() : Observable<object[]> {
    return this.http.get<object[]>(
      '/api/v1/game?sort=last_played DESC&limit=10&where={"has_mapping": true,"last_played": {"!=": null}}'
    ).pipe(catchError(this.handleError('getLastPlayed', [])));
  }

  getGame(gameId: number): Observable<Game> {
    return this.http.get<Game>(`/api/v1/game/${gameId}`).pipe(catchError(this.handleError('getGame', new Game)));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
